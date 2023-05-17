-- AlterTable
ALTER TABLE "WorkflowRuntimeData" ADD COLUMN     "assigneeId" TEXT;

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_assigneeId_status_idx" ON "WorkflowRuntimeData"("assigneeId", "status");

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
