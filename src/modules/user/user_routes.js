const express = require("express");
const router = express.Router();
const { getUsers, getUser, updateRole, updateStatus, removeUser } = require("./user_controller");
const { validateUpdateRole, validateUpdateStatus } = require("./user_validator");
const { protect } = require("../../middleware/auth_middleware");
const { authorize } = require("../../middleware/rbac_middleware");

router.use(protect, authorize("admin"));

router.get("/", getUsers);

router.get("/:id", getUser);

router.patch("/:id/role", validateUpdateRole, updateRole);

router.patch("/:id/status", validateUpdateStatus, updateStatus);

router.delete("/:id", removeUser);

module.exports = router;