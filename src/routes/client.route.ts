// src/routes/clientRoutes.ts
import express from "express";
import {
  addTaskToClient,
  deleteClient,
  getAllClients,
  getClientDetails,
  loginClient,
  onboardClient,
  onboardClientsBulk,
  updateClient,
  updateClientByAdmin,
  updateClientEmail,
  updateClientPassword,
  uploadCreditReport,
} from "../controllers/client.controller";
import { protect } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate";
import {
  addClientsBulk,
  addClientValidation,
} from "../validations/client.validation";
import multer from 'multer';
const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({ storage });

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
router.put("/update/:id", updateClientByAdmin);
router.delete("/delete/:id", protect, deleteClient);
router.put("/changeEmail", protect, updateClientEmail);
router.put("/changePassword", protect, updateClientPassword);
router.put("/addTask", protect, addTaskToClient);
router.post("/uploadCreditReport/:clientId", protect,upload.single('file'), uploadCreditReport);

export default router;
