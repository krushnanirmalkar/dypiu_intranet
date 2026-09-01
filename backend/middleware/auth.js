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

module.exports = {
  requireAuth,
  requireRole
};
