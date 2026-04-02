const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register new user
const registerUser = async ({ name, email, password, role }) => {
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  // Create user
  const user = await User.create({ name, email, password, role });

  // Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

// Login user
const loginUser = async ({ email, password }) => {
  // Find user with password field included
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check if account is active
  if (user.status === "inactive") {
    throw new ApiError(403, "Your account has been deactivated");
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

module.exports = { registerUser, loginUser };