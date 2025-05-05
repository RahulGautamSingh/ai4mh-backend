import { PrismaClient } from "../generated/prisma/index.js";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export const createForm = async(req, res) => {
    const { patientId, type } = req.body;
    const doctorId = req.doctorId;

    if (!patientId || !type) {
        return res
            .status(400)
            .json({ message: "patientId and form type are required" });
    }

    if (!["PHQ-9", "MADRS"].includes(type)) {
        return res.status(400).json({ message: "Invalid form type" });
    }

    const patient = await prisma.patient.findUnique({
        where: {
            identifier: patientId,
        },
    });
    if (!patient) {
        return res
            .status(400)
            .json({
                message: "Patient doesn't exist. Please, create patient first.",
            });
    }
    try {
        const formId = `${type}-${patientId}-${nanoid(6).toUpperCase()}`;

        const form = await prisma.form.create({
            data: {
                formId,
                type,
                patientId: patient.id,
                doctorId,
            },
            include: {
                patient: true, // include related patient data
            }
        });

        res.status(201).json({ message: "Form created", form });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const submitForm = async(req, res) => {
    const { formId } = req.params;
    const { responses } = req.body;

    if (!responses || typeof responses !== "object") {
        return res.status(400).json({ message: "Invalid or missing responses" });
    }

    try {
        const form = await prisma.form.findUnique({ where: { formId } });
        if (!form) return res.status(404).json({ message: "Form not found" });
        if (form.submitted)
            return res.status(400).json({ message: "Form already submitted" });

        const score = Object.values(responses).reduce(
            (sum, val) => sum + Number(val),
            0
        );
        // const assessment = getDepressionSeverity(score, form.type);

        const updatedForm = await prisma.form.update({
            where: { formId },
            data: {
                responses,
                score,
                submitted: true,
            },
            include: {
                patient: true, // include related patient data
            }
        });

        res
            .status(200)
            .json({ message: "Form submitted successfully", form: updatedForm });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const deleteForm = async(req, res) => {
    const { formId } = req.params;
    const doctorId = req.doctorId;

    try {
        const form = await prisma.form.findUnique({ where: { formId } });
        if (!form) return res.status(404).json({ message: "Form not found" });
        if (form.doctorId !== doctorId)
            return res.status(403).json({ message: "Unauthorized" });

        await prisma.form.delete({ where: { formId } });

        res.status(200).json({ message: "Form deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getForm = async(req, res) => {
    const { formId } = req.params;

    try {
        const form = await prisma.form.findUnique({
            where: { formId },
            include: {
                patient: true, // include related patient data
                doctor: true, // include related doctor data
            }
        });

        if (!form) return res.status(404).json({ message: "Form not found" });

        res.status(200).json(form);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// function getDepressionSeverity(score, formType) {
//     let severity;
//     if (form.type === "PHQ-9") {
//         if (score <= 4) severity = "None-minimal";
//         else if (score <= 9) severity = "Mild";
//         else if (score <= 14) severity = "Moderate";
//         else if (score <= 19) severity = "Moderately Severe";
//         else severity = "Severe";
//     } else if (form.type === "MADRS") {
//         if (score <= 6) severity = "Normal";
//         else if (score <= 19) severity = "Mild";
//         else if (score <= 34) severity = "Moderate";
//         else severity = "Severe";
//     }
//     return severity;
// }