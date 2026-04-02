const express = require("express");
const router = express.Router();
const { getUsers, getUser, updateRole, updateStatus, removeUser } = require("./user_controller");
const { validateUpdateRole, validateUpdateStatus } = require("./user_validator");
const { protect } = require("../../middleware/auth_middleware");
const { authorize } = require("../../middleware/rbac_middleware");

// All user routes are admin only
router.use(protect, authorize("admin"));

// GET /api/users
router.get("/", getUsers);

// GET /api/users/:id
router.get("/:id", getUser);

// PATCH /api/users/:id/role
router.patch("/:id/role", validateUpdateRole, updateRole);

// PATCH /api/users/:id/status
router.patch("/:id/status", validateUpdateStatus, updateStatus);

// DELETE /api/users/:id
router.delete("/:id", removeUser);

module.exports = router;