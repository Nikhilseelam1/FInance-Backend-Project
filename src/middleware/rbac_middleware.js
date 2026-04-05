const ApiError = require("../utils/ApiError");

const authorize = (...roles) => {
  return (req, res, next) => {
    // protect middleware must run before this
    if (!req.user) {
      return next(new ApiError(401, "access denied. not authenticated"));
    }

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