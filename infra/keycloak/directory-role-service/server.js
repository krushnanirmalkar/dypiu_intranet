const express = require("express");
const { google } = require("googleapis");

const app = express();

const PORT = Number(process.env.PORT || 3002);

const GOOGLE_DIRECTORY_ADMIN =
  process.env.GOOGLE_DIRECTORY_ADMIN;

const DIRECTORY_LOOKUP_TOKEN =
  process.env.DIRECTORY_LOOKUP_TOKEN;

const GOOGLE_DIRECTORY_KEY_FILE =
  "/run/secrets/google-directory.json";

const GOOGLE_DIRECTORY_SCOPES = [
  "https://www.googleapis.com/auth/admin.directory.user.readonly"
];

if (!GOOGLE_DIRECTORY_ADMIN) {
  console.error("Missing GOOGLE_DIRECTORY_ADMIN");
  process.exit(1);
}

if (!DIRECTORY_LOOKUP_TOKEN) {
  console.error("Missing DIRECTORY_LOOKUP_TOKEN");
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  keyFile: GOOGLE_DIRECTORY_KEY_FILE,
  scopes: GOOGLE_DIRECTORY_SCOPES,
  clientOptions: {
    subject: GOOGLE_DIRECTORY_ADMIN
  }
});

const directory = google.admin({
  version: "directory_v1",
  auth
});

app.use(express.json());


function roleFromOrgUnit(orgUnitPath) {
  if (typeof orgUnitPath !== "string") {
    return null;
  }

  if (
    orgUnitPath === "/Students" ||
    orgUnitPath.startsWith("/Students/")
  ) {
    return "student";
  }

  if (
    orgUnitPath === "/Faculty" ||
    orgUnitPath.startsWith("/Faculty/")
  ) {
    return "faculty";
  }

  return null;
}


function requireInternalToken(req, res, next) {
  const authorization = req.get("authorization");

  if (
    authorization !==
    `Bearer ${DIRECTORY_LOOKUP_TOKEN}`
  ) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  next();
}


app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});


app.post(
  "/resolve",
  requireInternalToken,
  async (req, res) => {
    const email =
      String(req.body?.email || "")
        .trim()
        .toLowerCase();

    if (!email.endsWith("@dypiu.ac.in")) {
      return res.status(400).json({
        error: "Invalid DYPIU email address."
      });
    }

    try {
      const response =
        await directory.users.get({
          userKey: email,
          projection: "basic"
        });

      const user = response.data;

      const orgUnitPath =
        user.orgUnitPath || null;

      const baseRole =
        roleFromOrgUnit(orgUnitPath);

      return res.json({
        email: user.primaryEmail,
        orgUnitPath,
        baseRole
      });

    } catch (err) {
      console.error(
        "Directory lookup failed:",
        err.response?.status || err.message
      );

      return res.status(502).json({
        error: "Directory lookup failed."
      });
    }
  }
);


app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Directory role service running on port ${PORT}`
  );
});
