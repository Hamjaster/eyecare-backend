import express from "express";
import {
  addCreditor,
  deleteCreditor,
  getAllCreditors,
} from "../controllers/creditor.controller";
import { protect } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate";
import { addCreditorValidation } from "../validations/creditor.validation";

const router = express.Router();

router.get("/", protect, getAllCreditors);
router.post("/add", protect, validate(addCreditorValidation), addCreditor);
router.delete("/delete/:id", protect, deleteCreditor);

export default router;
