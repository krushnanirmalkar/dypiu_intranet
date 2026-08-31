require("dotenv").config();

const applications = require("./applications");
const { requireAuth, requireRole } = require("./middleware/auth");

const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const { createClient } = require("redis");
const { RedisStore } = require("connect-redis");
const { createRemoteJWKSet, jwtVerify } = require("jose");

const app = express();
app.disable("x-powered-by");

const PORT = Number(process.env.PORT || 3001);
const ABSOLUTE_SESSION_MAX_AGE = 5 * 60 * 60 * 1000;

// -------------------------
// Redis Session Store
// -------------------------

const redisClient = createClient({
  url: "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "dypiu:sess:"
});

const KEYCLOAK_BASE = "https://intranet.dypiu.ac.in/keycloak";
const REALM = "dypiu";
const CLIENT_ID = "dypiu-intranet";

const REDIRECT_URI =
  "https://intranet.dypiu.ac.in/auth/callback";

const POST_LOGOUT_REDIRECT_URI =
  "https://intranet.dypiu.ac.in/signed-out";

const ISSUER = `${KEYCLOAK_BASE}/realms/${REALM}`;

const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!CLIENT_SECRET || !SESSION_SECRET) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const JWKS = createRemoteJWKSet(
  new URL(`${ISSUER}/protocol/openid-connect/certs`)
);

app.set("trust proxy", 1);

app.use(
  session({
    store: redisStore,
    name: "__Host-dypiu-session",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60 * 1000
    }
  })
);

// Absolute session timeout
app.use((req, res, next) => {
  if (
    req.session.user &&
    req.session.authenticatedAt &&
    Date.now() - req.session.authenticatedAt > ABSOLUTE_SESSION_MAX_AGE
  ) {
    return req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy expired session:", err);
        return res.status(500).send("Session expiry failed.");
      }

      res.clearCookie("__Host-dypiu-session", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax"
      });

      return res.redirect("/signed-out");
    });
  }

  next();
});


// -------------------------
// Login
// -------------------------

app.get("/login", (req, res) => {
  const state = crypto.randomBytes(32).toString("base64url");
  const nonce = crypto.randomBytes(32).toString("base64url");
  const verifier = crypto.randomBytes(64).toString("base64url");

  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");

  req.session.oauthState = state;
  req.session.oidcNonce = nonce;
  req.session.codeVerifier = verifier;

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",

    // Skip Keycloak login UI completely
    kc_idp_hint: "google",

    // Require fresh authentication when a new portal session is created
    prompt: "login"
  });

  res.redirect(
    `${ISSUER}/protocol/openid-connect/auth?${params}`
  );
});


// -------------------------
// OIDC Callback
// -------------------------

app.get("/auth/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(401).send("Authentication failed.");
  }

  if (!code || !state) {
    return res.status(400).send("Invalid authentication response.");
  }

  if (state !== req.session.oauthState) {
    return res.status(400).send("Invalid OAuth state.");
  }

  try {
    const tokenResponse = await fetch(
      `${ISSUER}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: req.session.codeVerifier
        })
      }
    );

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error(tokens);
      return res.status(500).send("Token exchange failed.");
    }

    // -------------------------
    // Verify ID Token
    // -------------------------

    const { payload } = await jwtVerify(
      tokens.id_token,
      JWKS,
      {
        issuer: ISSUER,
        audience: CLIENT_ID
      }
    );

    if (payload.nonce !== req.session.oidcNonce) {
      return res.status(400).send("Invalid OIDC nonce.");
    }

    // -------------------------
    // Verify Access Token
    // -------------------------

    const { payload: accessPayload } = await jwtVerify(
      tokens.access_token,
      JWKS,
      {
        issuer: ISSUER
      }
    );

    // Access token currently has:
    // aud = account
    // azp = dypiu-intranet
    //
    // Therefore verify the authorized party separately.
    if (accessPayload.azp !== CLIENT_ID) {
      return res.status(401).send("Invalid access token client.");
    }

    // -------------------------
    // Extract Trusted DYPIU Roles
    // -------------------------

    const allowedRoles = [
      "student",
      "staff",
      "admin"
    ];

    const roles = Array.isArray(
      accessPayload.realm_access?.roles
    )
      ? accessPayload.realm_access.roles.filter((role) =>
          allowedRoles.includes(role)
        )
      : [];

    // -------------------------
    // Create Authenticated Session
    // -------------------------

    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Session creation failed.");
      }

      req.session.user = {
        sub: payload.sub,
        name: payload.name,
        email: payload.email,
        roles
      };

      req.session.authenticatedAt = Date.now();

      // Keep tokens server-side only
      req.session.tokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token
      };

      res.redirect("/");
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("OIDC validation failed.");
  }
});


// -------------------------
// Current User
// -------------------------

app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    authenticated: true,
    user: req.session.user
  });
});


// -------------------------
// Applications
// -------------------------

app.get("/api/applications", requireAuth, (req, res) => {
  const userRoles = req.session.user.roles || [];

  const visibleApplications = applications.filter((app) => {
    if (!app.enabled) {
      return false;
    }

    return app.roles.some((role) =>
      userRoles.includes(role)
    );
  });

  res.json({
    applications: visibleApplications
  });
});


// -------------------------
// Logout
// -------------------------

app.get("/logout", (req, res) => {
  const idToken = req.session.tokens?.idToken;

  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Logout failed.");
    }

    res.clearCookie("__Host-dypiu-session", {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax"
    });

    const params = new URLSearchParams({
      post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
      client_id: CLIENT_ID
    });

    if (idToken) {
      params.set("id_token_hint", idToken);
    }

    res.redirect(
      `${ISSUER}/protocol/openid-connect/logout?${params}`
    );
  });
});


// -------------------------
// Health
// -------------------------

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


// -------------------------
// Start Server
// -------------------------

async function startServer() {
  try {
    await redisClient.connect();

    console.log("Connected to Redis session store.");

    app.listen(PORT, "127.0.0.1", () => {
      console.log(
        `DYPIU backend running on http://127.0.0.1:${PORT}`
      );
    });
  } catch (err) {
    console.error("Failed to start backend:", err);
    process.exit(1);
  }
}

startServer();
