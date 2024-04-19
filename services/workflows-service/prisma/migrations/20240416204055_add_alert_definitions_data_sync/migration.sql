/*
  Warnings:

  - A unique constraint covering the columns `[crossEnvKey]` on the table `AlertDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "DataSyncTables" ADD VALUE 'AlertDefinition';

-- AlterTable
ALTER TABLE "AlertDefinition" ADD COLUMN     "crossEnvKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AlertDefinition_crossEnvKey_key" ON "AlertDefinition"("crossEnvKey");
