/*
  Warnings:

  - Added the required column `riskScore` to the `BusinessReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessReport" ADD COLUMN     "riskScore" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "BusinessReport_riskScore_idx" ON "BusinessReport"("riskScore");
