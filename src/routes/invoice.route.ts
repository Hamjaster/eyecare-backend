// src/routes/invoiceRoutes.ts
import express from "express";
import {
  createInvoice,
  getInvoicesByClient,
  updateInvoice,
  deleteInvoice,
  getInvoicesByUser,
} from "../controllers/invoice.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect, createInvoice);
router.get("/getInvoicesForClient", protect, getInvoicesByClient);
router.get("/getInvoicesForUser", protect, getInvoicesByUser);
router.put("/update/:id", protect, updateInvoice);
router.delete("/delete/:id", protect, deleteInvoice);

export default router;
