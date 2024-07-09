-- AlterTable
ALTER TABLE "BusinessReport" ADD COLUMN     "reportId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "BusinessReport_reportId_idx" ON "BusinessReport"("reportId");
