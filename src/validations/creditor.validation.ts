import Joi from "joi";

export const addCreditorValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
  }),
  phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        'Phone number must be between 10 and 15 digits, optionally starting with "+".',
      "string.empty": "Phone number is required.",
    }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required.",
  }),
  companyName: Joi.string().required().messages({
    "string.empty": "Company name is required.",
  }),
  accountType: Joi.string()
    .valid("credit", "debit", "loan")
    .required()
    .messages({
      "any.only": "Account type must be one of 'credit', 'debit', or 'loan'.",
      "string.empty": "Account type is required.",
    }),
  notes: Joi.string().optional().allow(null, ""),
});
