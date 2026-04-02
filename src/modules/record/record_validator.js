const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  req.body = value;
  next();
};

const createRecordSchema = Joi.object({
  amount: Joi.number().min(0).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount cannot be negative",
    "any.required": "Amount is required",
  }),
  type: Joi.string().valid("income", "expense").required().messages({
    "any.only": "Type must be either income or expense",
    "any.required": "Type is required",
  }),
  category: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Category must be at least 2 characters",
    "string.max": "Category cannot exceed 50 characters",
    "any.required": "Category is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Please provide a valid date",
    "any.required": "Date is required",
  }),
  notes: Joi.string().trim().max(200).optional().allow("").messages({
    "string.max": "Notes cannot exceed 200 characters",
  }),
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().min(0).messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount cannot be negative",
  }),
  type: Joi.string().valid("income", "expense").messages({
    "any.only": "Type must be either income or expense",
  }),
  category: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Category must be at least 2 characters",
    "string.max": "Category cannot exceed 50 characters",
  }),
  date: Joi.date().messages({
    "date.base": "Please provide a valid date",
  }),
  notes: Joi.string().trim().max(200).optional().allow("").messages({
    "string.max": "Notes cannot exceed 200 characters",
  }),
}).min(1);

module.exports = {
  validateCreateRecord: validate(createRecordSchema),
  validateUpdateRecord: validate(updateRecordSchema),
};