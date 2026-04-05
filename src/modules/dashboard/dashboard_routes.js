const express = require("express");
const router = express.Router();
const {
  summary,
  categoryWise,
  monthlyTrends,
  recentActivity,
} = require("./dashboard_controller");
const { protect } = require("../../middleware/auth_middleware");
const { authorize } = require("../../middleware/rbac_middleware");

router.use(protect, authorize("analyst", "admin"));

router.get("/summary", summary);

router.get("/category-wise", categoryWise);

router.get("/trends", monthlyTrends);

router.get("/recent", recentActivity);

module.exports = router;