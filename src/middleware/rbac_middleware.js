const ApiError = require("../utils/ApiError");

const authorize = (...roles) => {
  return (req, res, next) => {
    // protect middleware must run before this
    if (!req.user) {
      return next(new ApiError(401, "Access denied. Not authenticated"));
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

module.exports = { authorize };