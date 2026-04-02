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

// All dashboard routes — analyst and admin only
router.use(protect, authorize("analyst", "admin"));

// GET /api/dashboard/summary
router.get("/summary", summary);

// GET /api/dashboard/category-wise
router.get("/category-wise", categoryWise);

// GET /api/dashboard/trends
router.get("/trends", monthlyTrends);

// GET /api/dashboard/recent
router.get("/recent", recentActivity);

module.exports = router;