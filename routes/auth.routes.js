import { Router } from "oak";
import * as AuthController from "../controllers/auth.controller.js";

export const authRoutes = new Router();

// Admin auth
authRoutes.get("/admin/login", AuthController.showAdminLogin);
authRoutes.post("/admin/login", AuthController.adminLogin);
authRoutes.get("/admin/logout", AuthController.adminLogout);

// Staff auth
authRoutes.get("/staff/login", AuthController.showStaffLogin);
authRoutes.post("/staff/login", AuthController.staffLogin);
authRoutes.get("/staff/logout", AuthController.staffLogout);
