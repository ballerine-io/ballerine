-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "businessType" TEXT DEFAULT 'default';

-- CreateIndex
CREATE INDEX "Business_businessType_idx" ON "Business"("businessType");
