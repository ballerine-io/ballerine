/*
  Warnings:

  - You are about to drop the column `label` on the `AlertDefinition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[correlationId,projectId]` on the table `AlertDefinition` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correlationId` to the `AlertDefinition` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AlertDefinition_label_projectId_key";

-- AlterTable
ALTER TABLE "AlertDefinition" RENAME COLUMN  "label" TO "correlationId";

-- CreateIndex
CREATE UNIQUE INDEX "AlertDefinition_correlationId_projectId_key" ON "AlertDefinition"("correlationId", "projectId");
