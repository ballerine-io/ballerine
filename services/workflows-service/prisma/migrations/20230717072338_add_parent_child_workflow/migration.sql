-- AlterTable
ALTER TABLE "WorkflowRuntimeData" ADD COLUMN     "parent_runtime_data_id" TEXT;

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_parent_runtime_data_id_idx" ON "WorkflowRuntimeData"("parent_runtime_data_id");

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_parent_runtime_data_id_fkey" FOREIGN KEY ("parent_runtime_data_id") REFERENCES "WorkflowRuntimeData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
