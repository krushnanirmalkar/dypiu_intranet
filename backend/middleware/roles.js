function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({
        authenticated: false,
        message: "Authentication required."
      });
    }

    const userRoles = Array.isArray(user.roles)
      ? user.roles
      : [];

    const authorized = allowedRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!authorized) {
      return res.status(403).json({
        message: "Access denied."
      });
    }

    next();
  };
}

module.exports = {
  requireRole
};
