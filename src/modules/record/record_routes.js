const express = require("express");
const router = express.Router();
const { create, getAll, getOne, update, remove } = require("./record_controller");
const { validateCreateRecord, validateUpdateRecord } = require("./record_validator");
const { protect } = require("../../middleware/auth_middleware");
const { authorize } = require("../../middleware/rbac_middleware");

router.use(protect);

router.get("/", authorize("viewer", "analyst", "admin"), getAll);

router.get("/:id", authorize("viewer", "analyst", "admin"), getOne);

router.post("/", authorize("admin"), validateCreateRecord, create);

router.patch("/:id", authorize("admin"), validateUpdateRecord, update);

router.delete("/:id", authorize("admin"), remove);

module.exports = router;