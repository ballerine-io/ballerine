-- AlterEnum
ALTER TYPE "BusinessReportType" ADD VALUE 'MERCHANT_REPORT_T1_LITE';

-- AlterTable
ALTER TABLE "BusinessReport" ADD COLUMN     "batchId" TEXT;

-- CreateIndex
CREATE INDEX "BusinessReport_batchId_idx" ON "BusinessReport"("batchId");
