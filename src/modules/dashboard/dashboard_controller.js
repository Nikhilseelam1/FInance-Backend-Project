const {
  getSummary,
  getCategoryWise,
  getMonthlyTrends,
  getRecentActivity,
} = require("./dashboard_service");
const ApiResponse = require("../../utils/ApiResponse");

const summary = async (req, res, next) => {
  try {
    const data = await getSummary();
    return res
      .status(200)
      .json(new ApiResponse(200, "Summary fetched successfully", data));
  } catch (error) {
    next(error);
  }
};

const categoryWise = async (req, res, next) => {
  try {
    const data = await getCategoryWise();
    return res
      .status(200)
      .json(new ApiResponse(200, "Category wise data fetched successfully", data));
  } catch (error) {
    next(error);
  }
};

const monthlyTrends = async (req, res, next) => {
  try {
    const data = await getMonthlyTrends();
    return res
      .status(200)
      .json(new ApiResponse(200, "Monthly trends fetched successfully", data));
  } catch (error) {
    next(error);
  }
};

const recentActivity = async (req, res, next) => {
  try {
    const data = await getRecentActivity();
    return res
      .status(200)
      .json(new ApiResponse(200, "Recent activity fetched successfully", data));
  } catch (error) {
    next(error);
  }
};

module.exports = { summary, categoryWise, monthlyTrends, recentActivity };