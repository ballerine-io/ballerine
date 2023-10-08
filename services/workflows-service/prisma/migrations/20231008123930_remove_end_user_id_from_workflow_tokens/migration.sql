/*
  Warnings:

  - You are about to drop the column `endUserId` on the `WorkflowRuntimeDataToken` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkflowRuntimeDataToken" DROP CONSTRAINT "WorkflowRuntimeDataToken_endUserId_fkey";

-- AlterTable
ALTER TABLE "WorkflowRuntimeDataToken" DROP COLUMN "endUserId";
