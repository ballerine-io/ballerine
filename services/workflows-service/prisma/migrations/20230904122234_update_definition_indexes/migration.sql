-- DropIndex
DROP INDEX "WorkflowDefinition_projectId_name_definitionType_key";

-- CreateIndex
CREATE INDEX "WorkflowDefinition_projectId_name_definitionType_idx" ON "WorkflowDefinition"("projectId", "name", "definitionType");
