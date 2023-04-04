/*
  Warnings:

  - You are about to drop the column `workflowRuntimeDataId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_workflowRuntimeDataId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "workflowRuntimeDataId";
