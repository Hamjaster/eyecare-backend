// src/routes/clientRoutes.ts
import express from "express";
import {
    addTimelineItem,
 getTimeline
} from "../controllers/timeline.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect,  addTimelineItem);
router.get(
  "/get/:companyId",
  protect,
  getTimeline
);


export default router;
