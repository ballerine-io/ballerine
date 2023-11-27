/*
  Warnings:

  - Made the column `projectId` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `EndUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `Filter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `UiDefinition` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `WorkflowRuntimeData` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_projectId_fkey";

-- DropForeignKey
ALTER TABLE "EndUser" DROP CONSTRAINT "EndUser_projectId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Filter" DROP CONSTRAINT "Filter_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UiDefinition" DROP CONSTRAINT "UiDefinition_projectId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowRuntimeData" DROP CONSTRAINT "WorkflowRuntimeData_projectId_fkey";

-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "EndUser" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Filter" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UiDefinition" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "WorkflowRuntimeData" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EndUser" ADD CONSTRAINT "EndUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UiDefinition" ADD CONSTRAINT "UiDefinition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
