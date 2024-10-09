/*
  Warnings:

  - You are about to drop the column `backend` on the `WorkflowDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `supportedPlatforms` on the `WorkflowDefinition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkflowDefinition" DROP COLUMN "backend",
DROP COLUMN "supportedPlatforms";
