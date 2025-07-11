const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      statusCode: 403,
      message: 'Access denied.'
    });
  }
  next();
};

module.exports = allowRoles;