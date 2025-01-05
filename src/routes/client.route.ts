// src/routes/clientRoutes.ts
import express from "express";
import {
  deleteClient,
  getAllClients,
  loginClient,
  onboardClient,
  onboardClientsBulk,
  updateClient,
} from "../controllers/client.controller";
import { protect } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate";
import {
  addClientsBulk,
  addClientValidation,
} from "../validations/client.validation";
const router = express.Router();

router.post("/onboard", protect, validate(addClientValidation), onboardClient);
router.post(
  "/onboardBulk",
  protect,
  validate(addClientsBulk),
  onboardClientsBulk
);
router.get("/getAllClients", protect, getAllClients);
router.post("/login", loginClient);
router.put("/update/:id", updateClient);
router.delete("/delete/:id", protect, deleteClient);

export default router;
