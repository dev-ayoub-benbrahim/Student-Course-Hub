import { Router } from "oak";
import * as AdminController from "../controllers/admin.controller.js";
import { requireAdminAuth } from "../middleware/auth.js";

export const adminRoutes = new Router();

// Dashboard
adminRoutes.get("/admin/dashboard", requireAdminAuth, AdminController.showDashboard);

// Programmes
adminRoutes.get("/admin/programmes", requireAdminAuth, AdminController.listProgrammes);
adminRoutes.get("/admin/programmes/create", requireAdminAuth, AdminController.showCreateProgramme);
adminRoutes.post("/admin/programmes/create", requireAdminAuth, AdminController.createProgramme);
adminRoutes.get("/admin/programmes/:id/edit", requireAdminAuth, AdminController.showEditProgramme);
adminRoutes.post("/admin/programmes/:id/update", requireAdminAuth, AdminController.updateProgramme);
adminRoutes.post("/admin/programmes/:id/delete", requireAdminAuth, AdminController.deleteProgramme);
adminRoutes.post("/admin/programmes/:id/toggle-published", requireAdminAuth, AdminController.togglePublished);

// Programme modules
adminRoutes.get("/admin/programmes/:id/modules", requireAdminAuth, AdminController.showProgrammeModules);
adminRoutes.post("/admin/programmes/:id/modules", requireAdminAuth, AdminController.assignModuleToProgramme);
adminRoutes.post("/admin/programmes/:id/modules/:moduleId/remove", requireAdminAuth, AdminController.removeModuleFromProgramme);

// Mailing list
adminRoutes.get("/admin/programmes/:id/mailing-list", requireAdminAuth, AdminController.showMailingList);
adminRoutes.get("/admin/programmes/:id/mailing-list/export", requireAdminAuth, AdminController.exportMailingList);

// Modules
adminRoutes.get("/admin/modules", requireAdminAuth, AdminController.listModules);
adminRoutes.get("/admin/modules/create", requireAdminAuth, AdminController.showCreateModule);
adminRoutes.post("/admin/modules/create", requireAdminAuth, AdminController.createModule);
adminRoutes.get("/admin/modules/:id/edit", requireAdminAuth, AdminController.showEditModule);
adminRoutes.post("/admin/modules/:id/update", requireAdminAuth, AdminController.updateModule);
adminRoutes.post("/admin/modules/:id/delete", requireAdminAuth, AdminController.deleteModule);

// Students
adminRoutes.get("/admin/students", requireAdminAuth, AdminController.listStudents);
adminRoutes.post("/admin/students/:id/delete", requireAdminAuth, AdminController.deleteStudent);
