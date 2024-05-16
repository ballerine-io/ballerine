-- CreateEnum
CREATE TYPE "BusinessReportType" AS ENUM ('ONGOING_MERCHANT_REPORT_T1', 'ONGOING_MERCHANT_REPORT_T2', 'MERCHANT_REPORT_T1', 'MERCHANT_REPORT_T2');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "features" JSONB;

-- CreateTable
CREATE TABLE "BusinessReport" (
    "id" TEXT NOT NULL,
    "type" "BusinessReportType" NOT NULL,
    "report" JSONB NOT NULL,
    "businessId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessReport_createdAt_idx" ON "BusinessReport"("createdAt");

-- CreateIndex
CREATE INDEX "BusinessReport_businessId_idx" ON "BusinessReport"("businessId");

-- CreateIndex
CREATE INDEX "BusinessReport_projectId_idx" ON "BusinessReport"("projectId");

-- CreateIndex
CREATE INDEX "BusinessReport_type_idx" ON "BusinessReport"("type");

-- CreateIndex
CREATE INDEX "WorkflowDefinition_variant_projectId_idx" ON "WorkflowDefinition"("variant", "projectId");

-- AddForeignKey
ALTER TABLE "BusinessReport" ADD CONSTRAINT "BusinessReport_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessReport" ADD CONSTRAINT "BusinessReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
