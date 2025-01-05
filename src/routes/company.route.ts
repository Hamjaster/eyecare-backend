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

const router = Router();

router.post("/team/add", protect, addTeamMember);
router.put("/team/edit/:userId", protect, editTeamMember);
router.post("/role/add", protect, addRole);
router.put("/role/edit", protect, editRole);
router.get("/roles", protect, getAllRoles);
router.get("/team", protect, getTeamMembers);
router.post("/updateCompany", protect, updateCompanyDetails);

export default router;
