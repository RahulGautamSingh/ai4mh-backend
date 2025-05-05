import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import doctorRoutes from "./routes/doctor.route.js";
import formRoutes from "./routes/form.route.js";
import patientRoutes from "./routes/patient.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use("/api/doctor", doctorRoutes);
app.use("/api/form", formRoutes);
app.use("/api/patient", patientRoutes);

// Root
app.get("/", (req, res) => {
    res.send("Mental Health API is running 🚀");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});