/*
  Warnings:

  - You are about to drop the `AssessmentForm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssessmentForm" DROP CONSTRAINT "AssessmentForm_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponse" DROP CONSTRAINT "FormResponse_formId_fkey";

-- DropTable
DROP TABLE "AssessmentForm";

-- DropTable
DROP TABLE "FormResponse";

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "formId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "responses" JSONB,
    "score" INTEGER,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_formId_key" ON "Form"("formId");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
