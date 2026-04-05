const FinancialRecord = require("../../models/FinancialRecord");

const getSummary = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const income = result.find((r) => r._id === "income")?.total || 0;
  const expenses = result.find((r) => r._id === "expense")?.total || 0;
  const netBalance = income - expenses;

  return { income, expenses, netBalance };
};

const getCategoryWise = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return result.map((r) => ({
    category: r._id.category,
    type: r._id.type,
    total: r.total,
    count: r.count,
  }));
};

const getMonthlyTrends = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 },
  ]);

  return result.map((r) => ({
    year: r._id.year,
    month: r._id.month,
    type: r._id.type,
    total: r.total,
    count: r.count,
  }));
};

const getRecentActivity = async () => {
  const records = await FinancialRecord.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(10);

  return records;
};

module.exports = {
  getSummary,
  getCategoryWise,
  getMonthlyTrends,
  getRecentActivity,
};