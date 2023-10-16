-- CreateEnum
CREATE TYPE "UiDefinitionContext" AS ENUM ('back_office', 'collection_flow');

-- CreateTable
CREATE TABLE "UiDefinition" (
    "id" TEXT NOT NULL,
    "workflowDefinitionId" TEXT NOT NULL,
    "uiContext" "UiDefinitionContext" NOT NULL,
    "page" INTEGER,
    "state" TEXT,
    "definition" JSONB,
    "uiSchema" JSONB NOT NULL,
    "schemaOptions" JSONB,
    "uiOptions" JSONB,
    "projectId" TEXT,

    CONSTRAINT "UiDefinition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UiDefinition" ADD CONSTRAINT "UiDefinition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UiDefinition" ADD CONSTRAINT "UiDefinition_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
