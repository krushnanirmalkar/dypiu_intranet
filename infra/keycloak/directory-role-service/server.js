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
    orgUnitPath.startsWith("/Faculty/") ||
    orgUnitPath === "/Staff" ||
    orgUnitPath.startsWith("/Staff/")
  ) {
    return "staff";
  }

  return null;
}


function prnFromEmail(email, baseRole) {
  if (baseRole !== "student") {
    return null;
  }

  const localPart =
    String(email || "")
      .split("@")[0]
      .trim();

  if (!/^\d+$/.test(localPart)) {
    return null;
  }

  return localPart;
}


function buildUniversityIdentity(user, directoryRole) {
  const email =
    String(user.primaryEmail || "")
      .trim()
      .toLowerCase();

  const status =
    user.suspended ? "disabled" : "active";

  return {
    email,
    prn: prnFromEmail(email, directoryRole),
    status,
    type: directoryRole,
    roles:
      status === "active" && directoryRole
        ? [directoryRole]
        : [],
    orgUnitPath: user.orgUnitPath || null
  };
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


function decodeGooglePhoto(photoData) {
  if (typeof photoData !== "string" || !/^[A-Za-z0-9_.\-*]+$/.test(photoData)) {
    return null;
  }

  const base64 = photoData
    .replace(/_/g, "/")
    .replace(/-/g, "+")
    .replace(/[.*]/g, "=");

  return Buffer.from(base64, "base64");
}


function photoContentType(mimeType) {
  const suppliedType = String(mimeType || "").toLowerCase();
  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff"
  ]);

  if (allowedTypes.has(suppliedType)) {
    return suppliedType;
  }

  const normalized = suppliedType.toUpperCase();
  const contentTypes = {
    JPEG: "image/jpeg",
    JPG: "image/jpeg",
    PNG: "image/png",
    GIF: "image/gif",
    BMP: "image/bmp",
    TIFF: "image/tiff"
  };

  return contentTypes[normalized] || "image/jpeg";
}


app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});


app.post(
  "/photo",
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
        await directory.users.photos.get({
          userKey: email
        });

      const photo = decodeGooglePhoto(
        response.data?.photoData
      );

      if (!photo || photo.length === 0) {
        return res.status(404).json({
          error: "Profile photo not found."
        });
      }

      res.set({
        "Content-Type": photoContentType(
          response.data?.mimeType
        ),
        "Cache-Control": "private, max-age=3600",
        "Content-Length": String(photo.length)
      });

      return res.send(photo);

    } catch (err) {
      const upstreamStatus = err.response?.status;

      if (upstreamStatus === 404) {
        return res.status(404).json({
          error: "Profile photo not found."
        });
      }

      console.error(
        "Directory photo lookup failed:",
        upstreamStatus || err.message
      );

      return res.status(502).json({
        error: "Directory photo lookup failed."
      });
    }
  }
);


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
          projection: "full"
        });

      const user = response.data;

      const orgUnitPath =
        user.orgUnitPath || null;

      const directoryRole =
        roleFromOrgUnit(orgUnitPath);

      const baseRole =
        user.suspended ? null : directoryRole;

      const universityIdentity =
        buildUniversityIdentity(user, directoryRole);

      return res.json({
        email: user.primaryEmail,
        orgUnitPath,
        baseRole,
        universityIdentity
      });

    } catch (err) {
      const upstreamStatus =
        err.response?.status;

      if (upstreamStatus === 404) {
        console.warn(
          "University directory record not found."
        );

        return res.status(404).json({
          error: "University record not found."
        });
      }

      console.error(
        "Directory lookup failed:",
        upstreamStatus || err.message
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
