import express from "express";
import {
  createDisputeItem,
  getAllDisputeItems,
  getDisputeItemById,
  updateDisputeItem,
  deleteDisputeItem,
  createReason,
  getReasons,
  createInstruction,
  getInstructions,
} from "../controllers/dispute.controller";
import {
  createDisputeLetter,
  getAllDisputeLetters,
  getDisputeLetterById,
  updateDisputeLetter,
  getAllRAWLetters,
  createCategory,
  getCategories,
  deleteDisputeLetter,
  getAllLetterTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,} from '../controllers/letter.controller'
import { valid } from "joi";
import validate from "../middlewares/validate";
import { disputeItemSchema } from "../validations/disputeItem.validation";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
// Dispute item routes
router.post("/addDisputeItem", validate(disputeItemSchema), createDisputeItem);
router.get("/getDisputeItems/:clientId", getAllDisputeItems);
router.put("/updateDisputeItem/:id", updateDisputeItem);
router.delete("/deleteDisputeItem/:id", deleteDisputeItem);

// letter templates routes
router.get("/getLetterTemplates", protect, getAllLetterTemplates);
router.post("/addLetterTemplate", protect, createTemplate);
router.put("/updateTemplate/:id", protect, updateTemplate); // Update a template
router.delete("/deleteTemplate/:id", protect, deleteTemplate); // Delete a template

// dispute letter routes
router.post("/addLetter", protect, createDisputeLetter);
router.post("/getDisputeLetters", protect, getAllDisputeLetters);
router.get("/getLetter/:id", getDisputeLetterById);
router.put("/updateLetter/:id", updateDisputeLetter);
router.delete("/deleteLetter/:id", deleteDisputeLetter);

// Reason routes
router.post("/addReason", protect, createReason);
router.get("/getReasons/:userId",protect, getReasons);

// Instruction routes
router.post("/addInstruction",protect, createInstruction);
router.get("/getInstructions/:userId",protect, getInstructions);

// Category routes
router.post("/addCategory",protect, createCategory);
router.get("/getCategories/:userId",protect, getCategories);

export default router;
