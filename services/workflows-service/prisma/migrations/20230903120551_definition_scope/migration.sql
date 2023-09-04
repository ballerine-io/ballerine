/*
  Warnings:

  - A unique constraint covering the columns `[name,version,projectId,definitionType]` on the table `WorkflowDefinition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,name,definitionType]` on the table `WorkflowDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WorkflowDefinition" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "projectId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinition_name_version_projectId_definitionType_key" ON "WorkflowDefinition"("name", "version", "projectId", "definitionType");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinition_projectId_name_definitionType_key" ON "WorkflowDefinition"("projectId", "name", "definitionType");

-- AddForeignKey
ALTER TABLE "WorkflowDefinition" ADD CONSTRAINT "WorkflowDefinition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
