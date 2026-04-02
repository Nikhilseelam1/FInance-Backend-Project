const express = require("express");
const router = express.Router();
const { create, getAll, getOne, update, remove } = require("./record_controller");
const { validateCreateRecord, validateUpdateRecord } = require("./record_validator");
const { protect } = require("../../middleware/auth_middleware");
const { authorize } = require("../../middleware/rbac_middleware");

// All routes require authentication
router.use(protect);

// GET /api/records — viewer, analyst, admin
router.get("/", authorize("viewer", "analyst", "admin"), getAll);

// GET /api/records/:id — viewer, analyst, admin
router.get("/:id", authorize("viewer", "analyst", "admin"), getOne);

// POST /api/records — admin only
router.post("/", authorize("admin"), validateCreateRecord, create);

// PATCH /api/records/:id — admin only
router.patch("/:id", authorize("admin"), validateUpdateRecord, update);

// DELETE /api/records/:id — admin only
router.delete("/:id", authorize("admin"), remove);

module.exports = router;