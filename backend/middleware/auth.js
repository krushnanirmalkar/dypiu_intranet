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
