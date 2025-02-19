import { Router } from "express";

import {
  createCompany,
  addTeamMember,
  editTeamMember,
  addRole,
  editRole,
  getAllRoles,
  getTeamMembers,
  updateCompanyDetails,
} from "../controllers/company.controller";
import { protect } from "../middlewares/auth.middleware";
import { createTask, deleteTask, getTasksByClient, getTasksByCompany } from "../controllers/task.controller";

const router = Router();

router.post("/team/add", protect, addTeamMember);
router.put("/team/edit/:userId", protect, editTeamMember);
router.post("/role/add", protect, addRole);
router.put("/role/edit", protect, editRole);
router.get("/roles", protect, getAllRoles);
router.get("/team", protect, getTeamMembers);
router.post("/updateCompany", protect, updateCompanyDetails);

// Tasks routes 
router.get("/tasks", protect, getTasksByCompany);
router.get("/client/:clientId", protect, getTasksByClient);
router.post("/task", protect, createTask);
router.delete("/:taskId", protect, deleteTask);

export default router;
