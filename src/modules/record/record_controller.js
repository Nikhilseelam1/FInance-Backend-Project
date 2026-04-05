const {createRecord,getAllRecords,getRecordById,updateRecord,deleteRecord,} = require("./record_service");
const ApiResponse = require("../../utils/ApiResponse");

const create = async (req, res, next) => {
  try {
    const record = await createRecord(req.body, req.user._id);
    return res
      .status(201)
      .json(new ApiResponse(201, "Record created successfully", record));
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getAllRecords(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, "Records fetched successfully", result));
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const record = await getRecordById(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, "record fetched successfully", record));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const record = await updateRecord(req.params.id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, "record updated successfully", record));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await deleteRecord(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, result.message, null));
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getOne, update, remove };