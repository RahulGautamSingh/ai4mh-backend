import express from "express";
import {
    createForm,
    submitForm,
    deleteForm,
    getForm,
} from "../controllers/form.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Doctor-only routes
router.post("/create", verifyToken, createForm);
router.delete("/:formId", verifyToken, deleteForm);

// Public routes (for patients)
router.post("/submit/:formId", submitForm);
router.get("/:formId", getForm);

export default router;