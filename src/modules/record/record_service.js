const FinancialRecord = require("../../models/FinancialRecord");
const ApiError = require("../../utils/ApiError");

// Create a new record
const createRecord = async (data, userId) => {
  const record = await FinancialRecord.create({
    ...data,
    createdBy: userId,
  });
  return record;
};

// Get all records with filtering and pagination
const getAllRecords = async (query) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = query;

  // Build filter object
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = { $regex: category, $options: "i" };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const total = await FinancialRecord.countDocuments(filter);
  const records = await FinancialRecord.find(filter)
    .populate("createdBy", "name email role")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// Get single record
const getRecordById = async (id) => {
  const record = await FinancialRecord.findById(id).populate(
    "createdBy",
    "name email role"
  );
  if (!record) {
    throw new ApiError(404, "Record not found");
  }
  return record;
};

// Update record
const updateRecord = async (id, data) => {
  const record = await FinancialRecord.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email role");

  if (!record) {
    throw new ApiError(404, "Record not found");
  }
  return record;
};

// Soft delete record
const deleteRecord = async (id) => {
  const record = await FinancialRecord.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!record) {
    throw new ApiError(404, "Record not found");
  }
  return { message: "Record deleted successfully" };
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};