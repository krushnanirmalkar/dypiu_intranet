const store = require("../data/store");

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      authenticated: false,
      message: "Authentication required."
    });
  }

  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({
        authenticated: false,
        message: "Authentication required."
      });
    }

    const userRoles = Array.isArray(req.session.user.roles)
      ? req.session.user.roles
      : [];

    const authorized = allowedRoles.some(
      role => userRoles.includes(role)
    );

    if (!authorized) {
      console.warn(JSON.stringify({
        type: "security_audit",
        event: "authorization_denied",
        timestamp: new Date().toISOString(),
        email: req.session.user?.email || null,
        userRoles,
        requiredRoles: allowedRoles,
        ip: req.ip || null,
        method: req.method || null,
        path: req.path || null
      }));

      return res.status(403).json({
        authenticated: true,
        message: "Forbidden."
      });
    }

    next();
  };
}

function requireSuperAdmin(req, res, next) {
  return requireRole("super_admin", "admin")(req, res, next);
}

function requireServicePermission(service, requiredLevel = "read") {
  return async (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({
        authenticated: false,
        message: "Authentication required."
      });
    }

    const user = req.session.user;
    const userRoles = Array.isArray(user.roles) ? user.roles : [];

    if (user.isSuperAdmin || userRoles.includes("super_admin") || userRoles.includes("admin")) {
      return next();
    }

    const access = await store.evaluateUserAccess(user.email, userRoles);
    if (!access.allowedServices.includes(service)) {
      return res.status(403).json({
        authenticated: true,
        message: `Forbidden. You do not have access to the '${service}' service.`
      });
    }

    if (requiredLevel === "write" && access.accessLevel === "read") {
      return res.status(403).json({
        authenticated: true,
        message: `Forbidden. Write permission required for '${service}'.`
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
  requireSuperAdmin,
  requireServicePermission
};

