const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");

// Get all users
const getAllUsers = async () => {
  const users = await User.find().select("-__v");
  return users;
};

// Get single user
const getUserById = async (id) => {
  const user = await User.findById(id).select("-__v");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

// Update user role
const updateUserRole = async (id, role, requestingUserId) => {
  // Prevent admin from changing their own role
  if (id === requestingUserId.toString()) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// Update user status
const updateUserStatus = async (id, status, requestingUserId) => {
  // Prevent admin from deactivating themselves
  if (id === requestingUserId.toString()) {
    throw new ApiError(400, "You cannot change your own status");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// Delete user
const deleteUser = async (id, requestingUserId) => {
  // Prevent admin from deleting themselves
  if (id === requestingUserId.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { message: "User deleted successfully" };
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};