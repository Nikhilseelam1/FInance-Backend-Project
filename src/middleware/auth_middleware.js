const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    // 1. Check if token exists in header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Access denied. No token provided"));
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user from token payload
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, "User no longer exists"));
    }

    // 5. Check if user is active
    if (user.status === "inactive") {
      return next(new ApiError(403, "Your account has been deactivated"));
    }

    // 6. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };