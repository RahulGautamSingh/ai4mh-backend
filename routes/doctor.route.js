import { Router } from "express";
import {
    getDoctorProfile,
    registerDoctor,
    loginDoctor,
    logoutDoctor,
} from "../controllers/doctor.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/logout", logoutDoctor);

router.get("/profile", verifyToken, getDoctorProfile);

export default router;