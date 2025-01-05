import Joi from "joi";

export const addClientValidation = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required.",
  }),
  middleName: Joi.string().optional(),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
  }),
  last4SSN: Joi.string()
    .pattern(/^\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "Last 4 SSN must be exactly 4 digits.",
      "string.empty": "Last 4 SSN is required.",
    }),
  dateOfBirth: Joi.date().required().messages({
    "date.base": "Invalid date of birth format.",
    "any.required": "Date of birth is required.",
  }),
  mailingAddress: Joi.string().required().messages({
    "string.empty": "Mailing address is required.",
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required.",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City is required.",
  }),
  state: Joi.string().required().messages({
    "string.empty": "State is required.",
  }),
  zipCode: Joi.string()
    .pattern(/^\d{5}$/)
    .required()
    .messages({
      "string.pattern.base": "Zip code must be exactly 5 digits.",
      "string.empty": "Zip code is required.",
    }),
  phoneMobile: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        'Phone number must be between 10 and 15 digits, optionally starting with "+".',
      "string.empty": "Mobile phone number is required.",
    }),
  phoneAlternate: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        'Alternate phone number must be between 10 and 15 digits, optionally starting with "+".',
    }),
  fax: Joi.string().optional().allow(null, ""),
  status: Joi.string().required().messages({
    "string.empty": "Status is required.",
  }),
  startDate: Joi.date().required().messages({
    "date.base": "Invalid start date format.",
    "any.required": "Start date is required.",
  }),
  assignedTo: Joi.string().required().messages({
    "string.empty": "Assigned to field is required.",
  }),
  referredBy: Joi.string().required().messages({
    "string.empty": "Referred by field is required.",
  }),
});

// Validation for a list of clients
export const addClientsBulk = Joi.array()
  .items(addClientValidation)
  .min(1)
  .required()
  .messages({
    "array.base": "Clients data must be an array.",
    "array.min": "At least one client must be provided.",
  });
