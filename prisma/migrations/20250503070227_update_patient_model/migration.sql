/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Patient_name_key";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_identifier_key" ON "Patient"("identifier");
