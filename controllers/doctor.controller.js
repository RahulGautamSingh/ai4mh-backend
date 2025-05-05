import { hash as _hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Register
export async function registerDoctor(req, res) {
    const { name, email, password } = req.body;

    try {
        const existing = await prisma.doctor.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ message: "Email already exists" });

        const hash = await _hash(password, 10);
        const doctor = await prisma.doctor.create({
            data: {
                name,
                email,
                passwordHash: hash,
            },
        });

        res.status(201).json({
            message: "Doctor registered",
            doctor: { id: doctor.id, name: doctor.name, email: doctor.email },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// Login
export async function loginDoctor(req, res) {
    const { email, password } = req.body;

    try {
        const doctor = await prisma.doctor.findUnique({ where: { email } });
        if (!doctor)
            return res.status(400).json({ message: "Invalid credentials" });

        const match = await compare(password, doctor.passwordHash);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ doctorId: doctor.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// Logout (optional - token-based auth is stateless)
export function logoutDoctor(req, res) {
    // You can invalidate token by tracking them in a DB or on client side just delete token.
    res.json({ message: "Logout successful (client should delete token)" });
}

export const getDoctorProfile = async(req, res) => {
    const doctorId = req.doctorId;

    if (!doctorId) {
        return res
            .status(401)
            .json({ message: "Unauthorized: doctor not logged in" });
    }

    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId },
            include: {
                forms: {
                    include: {
                        patient: true,
                    },
                },
                patients: true,
            }, // ← this is Prisma's equivalent of populate
        });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};