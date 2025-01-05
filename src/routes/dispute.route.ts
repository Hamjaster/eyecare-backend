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
} from "../controllers/dispute.controller";
import { valid } from "joi";
import validate from "../middlewares/validate";
import { disputeItemSchema } from "../validations/disputeItem.validation";

const router = express.Router();
// Dispute item routes
router.post("/addDisputeItem", validate(disputeItemSchema), createDisputeItem);
router.get("/getDisputeItems/:clientId", getAllDisputeItems);
router.put("/updateDisputeItem/:id", updateDisputeItem);
router.delete("/deleteDisputeItem/:id", deleteDisputeItem);

// Dispute letter routes
router.post("/addLetter", createDisputeLetter);
router.get("/getLetters", getAllDisputeLetters);
router.get("/getLetter/:id", getDisputeLetterById);
router.put("/updateLetter/:id", updateDisputeLetter);
router.delete("/deleteLetter/:id", deleteDisputeLetter);

export default router;
