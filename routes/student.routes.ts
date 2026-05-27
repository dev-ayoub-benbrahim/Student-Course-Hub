import { Router } from "oak";
import * as StudentController from "../controllers/student.controller.ts";

export const studentRoutes = new Router();

// Public routes
studentRoutes.get("/", StudentController.listProgrammes);
studentRoutes.get("/programmes/:id", StudentController.viewProgramme);
studentRoutes.get("/modules/:id", StudentController.viewModule);

// Interest registration
studentRoutes.get("/register-interest/:id", StudentController.showRegisterInterest);
studentRoutes.post("/register-interest/:id", StudentController.registerInterest);

// My interests
studentRoutes.get("/my-interests", StudentController.showMyInterests);
studentRoutes.post("/withdraw-interest", StudentController.withdrawInterest);

// Search
studentRoutes.get("/search", StudentController.searchProgrammes);

// JSON API
studentRoutes.get("/api/programmes", StudentController.apiListProgrammes);
studentRoutes.post("/api/interest/:id", StudentController.apiToggleInterest);