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

const updateRoleSchema = Joi.object({
  role: Joi.string().valid("admin", "analyst", "viewer").required().messages({
    "any.only": "Role must be one of: admin, analyst, viewer",
    "any.required": "Role is required",
  }),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid("active", "inactive").required().messages({
    "any.only": "Status must be either active or inactive",
    "any.required": "Status is required",
  }),
});

module.exports = {
  validateUpdateRole: validate(updateRoleSchema),
  validateUpdateStatus: validate(updateStatusSchema),
};