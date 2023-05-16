/*
  Warnings:

  - A unique constraint covering the columns `[correlationId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correlationId]` on the table `EndUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "legalForm" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "industry" DROP NOT NULL,
ALTER COLUMN "documents" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Business_correlationId_key" ON "Business"("correlationId");

-- CreateIndex
CREATE INDEX "Business_correlationId_idx" ON "Business"("correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "EndUser_correlationId_key" ON "EndUser"("correlationId");
