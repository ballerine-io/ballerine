/*
  Warnings:

  - Added the required column `status` to the `BusinessReport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessReportStatus" AS ENUM ('in_progress', 'completed');

-- AlterTable
ALTER TABLE "BusinessReport" ADD COLUMN     "status" "BusinessReportStatus" NOT NULL;
