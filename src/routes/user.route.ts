// src/routes/userRoutes.ts
import express from "express";
import {
  getUserDetails,
  loginUser,
  registerUser,
  updateUser,
  updateUserEmail,
  updateUserPassword,
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/register", registerUser);
router.get("/userDetails", protect, getUserDetails);
router.post("/login", loginUser);
router.put("/update", protect, updateUser);
router.put("/changeEmail", protect, updateUserEmail);
router.put("/changePassword", protect, updateUserPassword);

export default router;
