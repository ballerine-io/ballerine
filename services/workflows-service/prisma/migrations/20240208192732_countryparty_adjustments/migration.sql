/*
  Warnings:

  - Added the required column `projectId` to the `Counterparty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Counterparty" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Counterparty" ADD CONSTRAINT "Counterparty_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
