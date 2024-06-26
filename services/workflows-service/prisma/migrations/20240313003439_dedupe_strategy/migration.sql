/*
  Warnings:

  - You are about to drop the column `dedupeStrategies` on the `AlertDefinition` table. All the data in the column will be lost.
  - Added the required column `dedupeStrategy` to the `AlertDefinition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AlertDefinition" DROP COLUMN "dedupeStrategies",
ADD COLUMN     "dedupeStrategy" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt" DESC);
