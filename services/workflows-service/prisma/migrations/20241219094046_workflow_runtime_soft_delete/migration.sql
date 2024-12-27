-- AlterTable
ALTER TABLE "WorkflowRuntimeData" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT;

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_deletedAt_idx" ON "WorkflowRuntimeData"("deletedAt");
