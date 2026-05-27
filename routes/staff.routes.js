import { Router } from "oak";
import * as StaffController from "../controllers/staff.controller.js";
import { requireStaffAuth } from "../middleware/auth.js";

export const staffRoutes = new Router();

staffRoutes.get("/staff/dashboard", requireStaffAuth, StaffController.showDashboard);
