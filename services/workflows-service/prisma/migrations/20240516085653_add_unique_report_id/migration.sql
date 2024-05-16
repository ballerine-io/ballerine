/*
  Warnings:

  - A unique constraint covering the columns `[reportId]` on the table `BusinessReport` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BusinessReport_reportId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "BusinessReport_reportId_key" ON "BusinessReport"("reportId");
