import { Router } from "express";
import { createPatient, getPatient } from "../controllers/patient.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add", verifyToken, createPatient);
router.get("/:patientId", verifyToken, getPatient);

export default router;