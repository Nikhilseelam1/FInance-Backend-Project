const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require("./user_service");
const ApiResponse = require("../../utils/ApiResponse");
const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    return res
      .status(200)
      .json(new ApiResponse(200, "users fetched successfully", users));
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, "user fetched successfully", user));
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const user = await updateUserRole(
      req.params.id,
      req.body.role,
      req.user._id
    );
    return res
      .status(200)
      .json(new ApiResponse(200, "user role updated successfully", user));
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const user = await updateUserStatus(
      req.params.id,
      req.body.status,
      req.user._id
    );
    return res
      .status(200)
      .json(new ApiResponse(200, "user status updated successfully", user));
  } catch (error) {
    next(error);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const result = await deleteUser(req.params.id, req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, result.message, null));
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, updateRole, updateStatus, removeUser };