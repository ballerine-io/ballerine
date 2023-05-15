/*
  Warnings:

  - Added the required column `updatedAt` to the `Filter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filter" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
