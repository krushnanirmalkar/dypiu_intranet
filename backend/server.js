require("dotenv").config();

const applications = require("./applications");
const { requireAuth, requireRole, requireSuperAdmin, requireServicePermission } = require("./middleware/auth");
const store = require("./data/store");
const db = require("./db");

const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const { execFile } = require("child_process");
const { createClient } = require("redis");
const { RedisStore } = require("connect-redis");
const {
  createRemoteJWKSet,
  jwtVerify,
  errors: {
    JWTExpired,
    JWTClaimValidationFailed,
    JWSSignatureVerificationFailed,
    JWTInvalid,
    JWSInvalid
  }
} = require("jose");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10mb" }));

function isValidSafeUrl(urlStr) {
  if (typeof urlStr !== "string" || !urlStr.trim()) return false;
  const trimmed = urlStr.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return false;
  }
  if (trimmed.startsWith("data:")) {
    return (
      trimmed.startsWith("data:application/pdf") ||
      trimmed.startsWith("data:application/msword") ||
      trimmed.startsWith("data:application/vnd.") ||
      trimmed.startsWith("data:image/") ||
      trimmed.startsWith("data:text/")
    );
  }
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return urlStr.startsWith("/") && !urlStr.startsWith("//");
  }
}

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

function audit(event, details = {}) {
  console.log(JSON.stringify({
    type: "security_audit",
    event,
    timestamp: new Date().toISOString(),
    ...details
  }));
}

function auditRequestMetadata(req) {
  return {
    ip: req.ip || null,
    method: req.method || null,
    path: req.path || null
  };
}

function normalizeProfilePicture(value) {
  if (typeof value !== "string" || value.length > 2048) return null;

  try {
    const pictureUrl = new URL(value);
    return pictureUrl.protocol === "https:" ? pictureUrl.href : null;
  } catch {
    return null;
  }
}

const POST_LOGOUT_REDIRECT_URI =
  "https://intranet.dypiu.ac.in/signed-out";

const ISSUER = `${KEYCLOAK_BASE}/realms/${REALM}`;

const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const DIRECTORY_ROLE_SERVICE_URL =
  process.env.DIRECTORY_ROLE_SERVICE_URL;
const DIRECTORY_LOOKUP_TOKEN =
  process.env.DIRECTORY_LOOKUP_TOKEN;

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
      const reason =
        tokens?.error || `HTTP ${tokenResponse.status}`;

      console.warn(
        "OIDC token exchange rejected:",
        reason
      );

      audit("login_rejected", {
        reason,
        ...auditRequestMetadata(req)
      });

      return res.status(401).send("Authentication failed.");
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
      audit("token_validation_failure", {
        reason: "nonce_mismatch",
        ...auditRequestMetadata(req)
      });

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
      audit("token_validation_failure", {
        reason: "access_token_client_mismatch",
        ...auditRequestMetadata(req)
      });

      return res.status(401).send("Invalid access token client.");
    }

    // -------------------------
    // Extract Trusted DYPIU Roles
    // -------------------------

    const allowedRoles = [
      "student",
      "staff",
      "admin",
      "super_admin"
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
        picture: normalizeProfilePicture(
          payload.picture || accessPayload.picture
        ),
        roles
      };

      req.session.authenticatedAt = Date.now();

      // Keep tokens server-side only
      req.session.tokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token
      };

      audit("login_success", {
        email: payload.email || null,
        roles,
        ...auditRequestMetadata(req)
      });

      res.redirect("/");
    });

  } catch (err) {
    if (
      err instanceof JWTExpired ||
      err instanceof JWTClaimValidationFailed ||
      err instanceof JWSSignatureVerificationFailed ||
      err instanceof JWTInvalid ||
      err instanceof JWSInvalid
    ) {
      const reason = err.code || err.name;

      console.warn(
        "OIDC token validation rejected:",
        reason
      );

      audit("token_validation_failure", {
        reason,
        ...auditRequestMetadata(req)
      });

      return res.status(401).send("Authentication failed.");
    }

    console.error(err);
    return res.status(500).send("OIDC validation failed.");
  }
});


// -------------------------
// -------------------------
// Current User
// -------------------------

app.get("/api/me", requireAuth, async (req, res) => {
  const userRoles = Array.isArray(req.session.user?.roles) ? req.session.user.roles : [];
  const permissions = await store.evaluateUserAccess(req.session.user?.email, userRoles);
  const isSuperAdmin = userRoles.includes("super_admin") || userRoles.includes("admin");
  const hasAdminPortalAccess = isSuperAdmin || (permissions.allowedServices && permissions.allowedServices.length > 0);

  res.json({
    authenticated: true,
    user: {
      ...req.session.user,
      isSuperAdmin,
      hasAdminPortalAccess,
      permissions,
      picture: "/api/me/photo"
    }
  });
});


app.get("/api/me/photo", requireAuth, async (req, res) => {
  if (!DIRECTORY_ROLE_SERVICE_URL || !DIRECTORY_LOOKUP_TOKEN) {
    return res.status(503).json({
      error: "Directory photo service is not configured."
    });
  }

  try {
    const photoResponse = await fetch(
      `${DIRECTORY_ROLE_SERVICE_URL.replace(/\/$/, "")}/photo`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DIRECTORY_LOOKUP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: req.session.user.email
        })
      }
    );

    if (photoResponse.status === 404) {
      return res.status(404).json({
        error: "Profile photo not found."
      });
    }

    if (!photoResponse.ok) {
      console.error(
        "Directory photo service rejected request:",
        photoResponse.status
      );

      return res.status(502).json({
        error: "Profile photo is temporarily unavailable."
      });
    }

    const photo = Buffer.from(
      await photoResponse.arrayBuffer()
    );

    if (photo.length === 0 || photo.length > 2 * 1024 * 1024) {
      return res.status(502).json({
        error: "Invalid profile photo response."
      });
    }

    res.set({
      "Content-Type":
        photoResponse.headers.get("content-type") ||
        "image/jpeg",
      "Cache-Control": "private, max-age=3600",
      "Content-Length": String(photo.length)
    });

    return res.send(photo);

  } catch (err) {
    console.error(
      "Directory photo request failed:",
      err.message
    );

    return res.status(502).json({
      error: "Profile photo is temporarily unavailable."
    });
  }
});


// -------------------------
// User-Facing Applications, Notices, Policies
// -------------------------

app.get("/api/applications", requireAuth, async (req, res) => {
  const userRoles = req.session.user.roles || [];
  const allApps = await store.getApplications(false); // only enabled

  const visibleApplications = allApps.filter((appItem) => {
    const appRoles = Array.isArray(appItem.roles) ? appItem.roles : [];
    return appRoles.some((role) => userRoles.includes(role));
  });

  res.json({
    applications: visibleApplications
  });
});

app.get("/api/notices", requireAuth, async (req, res) => {
  const userRoles = req.session.user.roles || [];
  const primaryRole = userRoles.includes("staff") ? "Staff" : "Students";

  const allNotices = await store.getNotices({ status: "published", checkExpiry: true });
  const notices = allNotices.filter((notice) => {
    if (notice.audience === "All") return true;
    if (notice.audience === primaryRole) return true;
    if (userRoles.includes("admin") || userRoles.includes("super_admin")) return true;
    return false;
  });

  res.json({ notices });
});

app.get("/api/policies", requireAuth, async (req, res) => {
  const policies = await store.getPolicies({ status: "published" });
  res.json({ policies });
});


// -------------------------
// SUPER ADMIN PORTAL APIs
// All routes under /api/admin/* requireSuperAdmin
// -------------------------

// Dashboard Summary
app.get("/api/admin/dashboard", requireAuth, async (req, res) => {
  const user = req.session.user;
  const userRoles = Array.isArray(user.roles) ? user.roles : [];
  const isSuperAdmin = userRoles.includes("super_admin") || userRoles.includes("admin");
  const permissions = await store.evaluateUserAccess(user.email, userRoles);

  if (!isSuperAdmin && (!permissions.allowedServices || permissions.allowedServices.length === 0)) {
    return res.status(403).json({ authenticated: true, message: "Forbidden. Admin portal access required." });
  }

  const allNotices = await store.getNotices();
  const allApps = await store.getApplications(true);
  const allPolicies = await store.getPolicies();
  const auditLogs = await store.getAuditLogs();

  const activeNotices = allNotices.filter((n) => n.status === "published").length;
  const publishedApplications = allApps.filter((a) => a.enabled !== false).length;
  const activePolicies = allPolicies.filter((p) => p.status === "published").length;
  const recentActions = auditLogs.length;

  res.json({
    stats: {
      activeNotices,
      publishedApplications,
      activePolicies,
      recentActions
    },
    recentNotices: allNotices.slice(0, 5),
    recentAuditLogs: auditLogs.slice(0, 5)
  });
});


// Notice Management
app.get("/api/admin/notices", requireServicePermission("notices", "read"), async (req, res) => {
  const { category, audience, status } = req.query;
  const notices = await store.getNotices({ category, audience, status });
  res.json({ notices });
});

app.post("/api/admin/notices", requireServicePermission("notices", "write"), async (req, res) => {
  const { title, content, category, audience, priority, status, publishAt, expiresAt, attachmentUrl, attachmentName, attachmentSize } = req.body || {};

  if (typeof title !== "string" || !title.trim() || title.trim().length > 300) {
    return res.status(400).json({ error: "Notice title is required and must be under 300 characters." });
  }

  if (typeof content !== "string" || !content.trim() || content.trim().length > 10000) {
    return res.status(400).json({ error: "Notice content is required and must be under 10000 characters." });
  }

  if (attachmentUrl && !isValidSafeUrl(attachmentUrl)) {
    return res.status(400).json({ error: "Invalid or unsafe attachment URL." });
  }

  const validCategories = ["Academic", "Administrative", "Campus", "Urgent"];
  const validAudiences = ["All", "Students", "Staff"];
  const validPriorities = ["Low", "Medium", "High", "Urgent"];
  const validStatuses = ["draft", "published", "archived"];

  const newNotice = await store.createNotice(
    {
      title: title.trim(),
      content: content.trim(),
      category: validCategories.includes(category) ? category : "Academic",
      audience: validAudiences.includes(audience) ? audience : "All",
      priority: validPriorities.includes(priority) ? priority : "Medium",
      status: validStatuses.includes(status) ? status : "published",
      author: req.session.user.name || "University Administration",
      publishAt: publishAt || new Date().toISOString(),
      expiresAt: expiresAt || null,
      attachmentUrl: typeof attachmentUrl === "string" ? attachmentUrl.trim() : null,
      attachmentName: typeof attachmentName === "string" ? attachmentName.trim() : null,
      attachmentSize: typeof attachmentSize === "string" ? attachmentSize.trim() : null
    },
    req
  );

  res.status(201).json({ notice: newNotice });
});

app.get("/api/admin/notices/:id", requireServicePermission("notices", "read"), async (req, res) => {
  const notice = await store.getNoticeById(req.params.id);
  if (!notice) {
    return res.status(404).json({ error: "Notice not found." });
  }
  res.json({ notice });
});

app.put("/api/admin/notices/:id", requireServicePermission("notices", "write"), async (req, res) => {
  const existing = await store.getNoticeById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Notice not found." });
  }

  const { title, content, category, audience, priority, status, publishAt, expiresAt, attachmentUrl, attachmentName, attachmentSize } = req.body || {};

  const updates = {};
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim() || title.trim().length > 300) {
      return res.status(400).json({ error: "Invalid title." });
    }
    updates.title = title.trim();
  }

  if (content !== undefined) {
    if (typeof content !== "string" || !content.trim() || content.trim().length > 10000) {
      return res.status(400).json({ error: "Invalid content." });
    }
    updates.content = content.trim();
  }

  if (attachmentUrl !== undefined) {
    if (attachmentUrl && !isValidSafeUrl(attachmentUrl)) {
      return res.status(400).json({ error: "Invalid or unsafe attachment URL." });
    }
    updates.attachmentUrl = attachmentUrl ? attachmentUrl.trim() : null;
  }

  if (attachmentName !== undefined) {
    updates.attachmentName = attachmentName ? attachmentName.trim() : null;
  }

  if (attachmentSize !== undefined) {
    updates.attachmentSize = attachmentSize ? attachmentSize.trim() : null;
  }

  if (category !== undefined) updates.category = category;
  if (audience !== undefined) updates.audience = audience;
  if (priority !== undefined) updates.priority = priority;
  if (status !== undefined) updates.status = status;
  if (publishAt !== undefined) updates.publishAt = publishAt;
  if (expiresAt !== undefined) updates.expiresAt = expiresAt;

  const updatedNotice = await store.updateNotice(req.params.id, updates, req);
  res.json({ notice: updatedNotice });
});

app.delete("/api/admin/notices/:id", requireServicePermission("notices", "write"), async (req, res) => {
  const existing = await store.getNoticeById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Notice not found." });
  }

  await store.deleteNotice(req.params.id, req);
  res.json({ success: true, message: "Notice deleted." });
});


// Application Management
app.get("/api/admin/applications", requireServicePermission("applications", "read"), async (req, res) => {
  const applicationsList = await store.getApplications(true);
  res.json({ applications: applicationsList });
});

app.post("/api/admin/applications", requireServicePermission("applications", "write"), async (req, res) => {
  const { name, shortName, description, url, icon, category, roles, enabled, displayOrder, ssoEnabled, highlightColor } = req.body || {};

  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    return res.status(400).json({ error: "Application name is required." });
  }

  if (!isValidSafeUrl(url)) {
    return res.status(400).json({ error: "Invalid or unsafe application URL." });
  }

  const newApp = await store.createApplication(
    {
      name: name.trim(),
      shortName: typeof shortName === "string" ? shortName.trim() : name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      url: url.trim(),
      icon: typeof icon === "string" ? icon.trim() : "LayoutDashboard",
      category: typeof category === "string" ? category.trim() : "Productivity",
      roles: Array.isArray(roles) && roles.length > 0 ? roles : ["student", "staff", "admin"],
      enabled: enabled !== false,
      displayOrder: Number(displayOrder) || 1,
      ssoEnabled: ssoEnabled !== false,
      highlightColor: typeof highlightColor === "string" ? highlightColor : undefined
    },
    req
  );

  res.status(201).json({ application: newApp });
});

app.get("/api/admin/applications/:id", requireServicePermission("applications", "read"), async (req, res) => {
  const appItem = await store.getApplicationById(req.params.id);
  if (!appItem) {
    return res.status(404).json({ error: "Application not found." });
  }
  res.json({ application: appItem });
});

app.put("/api/admin/applications/:id", requireServicePermission("applications", "write"), async (req, res) => {
  const existing = await store.getApplicationById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Application not found." });
  }

  const { name, shortName, description, url, icon, category, roles, enabled, displayOrder, ssoEnabled, highlightColor } = req.body || {};

  const updates = {};
  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({ error: "Invalid name." });
    }
    updates.name = name.trim();
  }

  if (url !== undefined) {
    if (!isValidSafeUrl(url)) {
      return res.status(400).json({ error: "Invalid or unsafe URL." });
    }
    updates.url = url.trim();
  }

  if (shortName !== undefined) updates.shortName = shortName;
  if (description !== undefined) updates.description = description;
  if (icon !== undefined) updates.icon = icon;
  if (category !== undefined) updates.category = category;
  if (roles !== undefined) updates.roles = roles;
  if (enabled !== undefined) updates.enabled = Boolean(enabled);
  if (displayOrder !== undefined) updates.displayOrder = Number(displayOrder);
  if (ssoEnabled !== undefined) updates.ssoEnabled = Boolean(ssoEnabled);
  if (highlightColor !== undefined) updates.highlightColor = highlightColor;

  const updatedApp = await store.updateApplication(req.params.id, updates, req);
  res.json({ application: updatedApp });
});

app.delete("/api/admin/applications/:id", requireServicePermission("applications", "write"), async (req, res) => {
  const existing = await store.getApplicationById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Application not found." });
  }

  await store.deleteApplication(req.params.id, req);
  res.json({ success: true, message: "Application deleted." });
});


// Policy Management
app.get("/api/admin/policies", requireServicePermission("policies", "read"), async (req, res) => {
  const { category, status } = req.query;
  const policies = await store.getPolicies({ category, status });
  res.json({ policies });
});

app.post("/api/admin/policies", requireServicePermission("policies", "write"), async (req, res) => {
  const { title, category, summary, content, version, status, effectiveDate } = req.body || {};

  if (typeof title !== "string" || !title.trim() || title.trim().length > 200) {
    return res.status(400).json({ error: "Policy title is required." });
  }

  const newPolicy = await store.createPolicy(
    {
      title: title.trim(),
      category: typeof category === "string" ? category.trim() : "Administrative",
      summary: typeof summary === "string" ? summary.trim() : "",
      content: typeof content === "string" ? content.trim() : "",
      version: typeof version === "string" ? version.trim() : "1.0",
      status: typeof status === "string" ? status.trim() : "published",
      effectiveDate: effectiveDate || new Date().toISOString().split("T")[0]
    },
    req
  );

  res.status(201).json({ policy: newPolicy });
});

app.get("/api/admin/policies/:id", requireServicePermission("policies", "read"), async (req, res) => {
  const policy = await store.getPolicyById(req.params.id);
  if (!policy) {
    return res.status(404).json({ error: "Policy not found." });
  }
  res.json({ policy });
});

app.put("/api/admin/policies/:id", requireServicePermission("policies", "write"), async (req, res) => {
  const existing = await store.getPolicyById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Policy not found." });
  }

  const { title, category, summary, content, version, status, effectiveDate } = req.body || {};

  const updates = {};
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim() || title.trim().length > 200) {
      return res.status(400).json({ error: "Invalid title." });
    }
    updates.title = title.trim();
  }

  if (category !== undefined) updates.category = category;
  if (summary !== undefined) updates.summary = summary;
  if (content !== undefined) updates.content = content;
  if (version !== undefined) updates.version = version;
  if (status !== undefined) updates.status = status;
  if (effectiveDate !== undefined) updates.effectiveDate = effectiveDate;

  const updatedPolicy = await store.updatePolicy(req.params.id, updates, req);
  res.json({ policy: updatedPolicy });
});

app.delete("/api/admin/policies/:id", requireServicePermission("policies", "write"), async (req, res) => {
  const existing = await store.getPolicyById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Policy not found." });
  }

  await store.deletePolicy(req.params.id, req);
  res.json({ success: true, message: "Policy deleted/archived." });
});


// Audit Log Management
app.get("/api/admin/audit", requireServicePermission("audit", "read"), async (req, res) => {
  const { action, resourceType, search } = req.query;
  let events = await store.getAuditLogs();

  if (action) {
    events = events.filter((e) => e.action === action);
  }

  if (resourceType) {
    events = events.filter((e) => e.resourceType === resourceType);
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    events = events.filter(
      (e) =>
        (e.summary && e.summary.toLowerCase().includes(q)) ||
        (e.actorEmail && e.actorEmail.toLowerCase().includes(q)) ||
        (e.action && e.action.toLowerCase().includes(q))
    );
  }

  res.json({ events });
});

// -------------------------
// Access Control / User Permission Endpoints
// -------------------------

app.get("/api/admin/access-rules", requireServicePermission("access", "read"), async (req, res) => {
  const { targetType, status, search } = req.query;
  const rules = await store.getAccessRules({ targetType, status, search });
  res.json({ rules });
});

app.post("/api/admin/access-rules", requireServicePermission("access", "write"), async (req, res) => {
  const { name, targetType, targetValue, services, accessLevel, status } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ message: "Rule name is required." });
  }
  if (!targetValue || typeof targetValue !== "string" || !targetValue.trim()) {
    return res.status(400).json({ message: "Target role or email address is required." });
  }

  const rule = await store.createAccessRule(
    { name, targetType, targetValue, services, accessLevel, status },
    req
  );
  res.status(201).json({ rule });
});

app.put("/api/admin/access-rules/:id", requireServicePermission("access", "write"), async (req, res) => {
  const { id } = req.params;
  const existing = await store.getAccessRuleById(id);
  if (!existing) {
    return res.status(404).json({ message: "Access rule not found." });
  }

  const updated = await store.updateAccessRule(id, req.body, req);
  res.json({ rule: updated });
});

app.delete("/api/admin/access-rules/:id", requireServicePermission("access", "write"), async (req, res) => {
  const { id } = req.params;
  const deleted = await store.deleteAccessRule(id, req);
  if (!deleted) {
    return res.status(404).json({ message: "Access rule not found." });
  }
  res.json({ success: true, id });
});

app.get("/api/me/permissions", requireAuth, async (req, res) => {
  const user = req.session.user;
  const evalResult = await store.evaluateUserAccess(user.email, user.roles || []);
  res.json(evalResult);
});


// -------------------------
// Logout
// -------------------------

app.get("/logout", (req, res) => {
  const idToken = req.session.tokens?.idToken;
  const email = req.session.user?.email || null;

  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Logout failed.");
    }

    audit("logout_success", {
      email,
      ...auditRequestMetadata(req)
    });

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
    await store.initStore();
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
