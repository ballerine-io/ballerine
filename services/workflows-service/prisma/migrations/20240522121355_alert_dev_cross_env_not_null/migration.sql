/*
  Warnings:

  - Made the column `crossEnvKey` on table `AlertDefinition` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AlertDefinition" ALTER COLUMN "crossEnvKey" SET NOT NULL;
