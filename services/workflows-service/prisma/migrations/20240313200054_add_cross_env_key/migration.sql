/*
  Warnings:

  - A unique constraint covering the columns `[crossEnvKey]` on the table `WorkflowDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WorkflowDefinition" ADD COLUMN     "crossEnvKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinition_crossEnvKey_key" ON "WorkflowDefinition"("crossEnvKey");
