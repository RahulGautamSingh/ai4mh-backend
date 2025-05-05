import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

// GET all patients for a doctor
export const getPatientsByDoctor = async(req, res) => {
    try {
        const doctorId = req.doctorId;
        const patients = await prisma.patient.findMany({
            where: { doctorId },
            orderBy: { createdAt: "desc" },
        });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch patients" });
    }
};

// GET one patient
export const getPatient = async(req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await prisma.patient.findUnique({
            where: { identifier: patientId },
            include: {
                forms: {
                    include: {
                        doctor: true,
                    },
                },
            },
        });
        console.log(patient);
        res.json(patient);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch patient" });
    }
};

// POST create new patient
export const createPatient = async(req, res) => {
    try {
        const doctorId = req.doctorId;
        const { name, identifier } = req.body;

        const existingPatient = await prisma.patient.findUnique({
            where: { identifier },
        });

        if (existingPatient) {
            return res
                .status(400)
                .json({ error: "Patient identifier already exists" });
        }

        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            return res.status(403).json({ error: "Doctor not found" });
        }

        const patient = await prisma.patient.create({
            data: { name, identifier, doctorId },
        });

        res.status(201).json(patient);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create patient" });
    }
};