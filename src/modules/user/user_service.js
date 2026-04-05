const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");

const getAllUsers = async () => {
  const users = await User.find().select("-__v");
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-__v");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const updateUserRole = async (id, role, requestingUserId) => {
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

const updateUserStatus = async (id, status, requestingUserId) => {
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

const deleteUser = async (id, requestingUserId) => {
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