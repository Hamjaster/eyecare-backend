// src/routes/clientRoutes.ts
import express from "express";
import {
  deleteClient,
  getAllClients,
  getClientDetails,
  loginClient,
  onboardClient,
  onboardClientsBulk,
  updateClient,
  updateClientEmail,
  updateClientPassword,
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
router.get("/userDetails", protect, getClientDetails);
router.post("/login", loginClient);
router.put("/update", protect, updateClient);
router.delete("/delete/:id", protect, deleteClient);
router.put("/changeEmail", protect, updateClientEmail);
router.put("/changePassword", protect, updateClientPassword);

export default router;
