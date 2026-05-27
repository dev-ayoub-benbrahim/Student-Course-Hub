import { Router } from "oak";
import * as StaffController from "../controllers/staff.controller.ts";
import { requireStaffAuth } from "../middleware/auth.ts";

export const staffRoutes = new Router();

staffRoutes.get("/staff/dashboard", requireStaffAuth, StaffController.showDashboard);