-- AlterTable
ALTER TABLE "WorkflowRuntimeData" ADD COLUMN     "tags" JSONB;

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_tags_idx" ON "WorkflowRuntimeData" USING GIN ("tags" jsonb_path_ops);
