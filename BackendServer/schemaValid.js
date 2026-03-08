const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please enter your full name",
    "any.required": "Full name is required",
  }),
  username: Joi.string().required().messages({
    "string.empty": "Please enter a username",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().allow("", null).optional().messages({
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string()
    .min(6)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .messages({
      "string.empty": "Please enter a password",
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base": "Password doesn't follow the required pattern",
      "any.required": "Password is required",
    }),
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Please enter your username",
    "any.required": "Username is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Please enter your password",
    "any.required": "Password is required",
  }),
});

const jobSchema = Joi.object({
  company_name: Joi.string().required().messages({
    "string.empty": "Please enter the company name",
    "any.required": "Company name is required",
  }),
  role: Joi.string().required().messages({
    "string.empty": "Please enter the job role",
    "any.required": "Job role is required",
  }),
  status: Joi.string().required().messages({
    "string.empty": "Please select a status",
    "any.required": "Status is required",
  }),
});

module.exports = { signupSchema, loginSchema, jobSchema };
