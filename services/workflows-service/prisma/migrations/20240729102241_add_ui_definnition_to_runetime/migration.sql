-- AlterTable
ALTER TABLE "WorkflowRuntimeData" ADD COLUMN     "uiDefinitionId" TEXT;

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_uiDefinitionId_idx" ON "WorkflowRuntimeData"("uiDefinitionId");

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_uiDefinitionId_fkey" FOREIGN KEY ("uiDefinitionId") REFERENCES "UiDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
