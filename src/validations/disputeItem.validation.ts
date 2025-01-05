import Joi from "joi";

// BureauDetails Validation Schema
const BureauDetailsSchema = Joi.object({
  status: Joi.string()
    .valid("Active", "Closed", "Disputed")
    .required()
    .messages({
      "any.only": "Status must be one of Active, Closed, or Disputed",
    }),
  accountName: Joi.string().optional(),
  dateReported: Joi.date().optional(),
  lastActivity: Joi.date().optional(),
  amount: Joi.number().optional(),
  plaintiff: Joi.string().optional(),
  ECOA: Joi.string().optional(),
  dateFiled: Joi.date().optional(),
});

// Main Dispute Item Validation Schema
export const disputeItemSchema = Joi.object({
  creditBureaus: Joi.array()
    .items(Joi.string().valid("Equifax", "Experian", "TransUnion"))
    .required()
    .messages({
      "array.includes":
        "Credit Bureaus must include valid values (Equifax, Experian, TransUnion)",
    }),
  accountNumber: Joi.string().optional(),
  differentAccountNumbers: Joi.object({
    Equifax: Joi.string().optional(),
    Experian: Joi.string().optional(),
    TransUnion: Joi.string().optional(),
  }).optional(),
  creditorFurnisher: Joi.string()
    .required()
    .messages({ "any.required": "Creditor/Furnisher is required" }),
  reason: Joi.string()
    .required()
    .messages({ "any.required": "Reason is required" }),
  instruction: Joi.string()
    .required()
    .messages({ "any.required": "Instruction is required" }),
  additionalDetails: Joi.object({
    Equifax: BureauDetailsSchema.optional(),
    Experian: BureauDetailsSchema.optional(),
    TransUnion: BureauDetailsSchema.optional(),
  }).optional(),
  forClient: Joi.string()
    .required()
    .messages({ "any.required": "forClient (Client ID) is required" }),
});
