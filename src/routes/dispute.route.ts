import express from "express";
import {
  createDisputeItem,
  getAllDisputeItems,
  getDisputeItemById,
  updateDisputeItem,
  deleteDisputeItem,
  createDisputeLetter,
  getAllDisputeLetters,
  getDisputeLetterById,
  updateDisputeLetter,
  deleteDisputeLetter,
  createReason,
  getReasons,
  createInstruction,
  getInstructions,
} from "../controllers/dispute.controller";
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

// Dispute letter routes
router.post("/addLetter", protect, createDisputeLetter);
router.get("/getLetters", protect, getAllDisputeLetters);
router.get("/getLetter/:id", getDisputeLetterById);
router.put("/updateLetter/:id", updateDisputeLetter);
router.delete("/deleteLetter/:id", deleteDisputeLetter);

// Reason routes
router.post("/addReason", protect, createReason);
router.get("/getReasons/:userId",protect, getReasons);

// Instruction routes
router.post("/addInstruction",protect, createInstruction);
router.get("/getInstructions/:userId",protect, getInstructions);

export default router;
