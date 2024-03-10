/*
  Warnings:

  - You are about to drop the column `businessId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `endUserId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `endUserId` on the `TransactionRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_endUserId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionRecord" DROP CONSTRAINT "TransactionRecord_businessId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionRecord" DROP CONSTRAINT "TransactionRecord_endUserId_fkey";

-- DropIndex
DROP INDEX "Alert_businessId_idx";

-- DropIndex
DROP INDEX "Alert_endUserId_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "businessId",
DROP COLUMN "endUserId";

-- AlterTable
ALTER TABLE "TransactionRecord" DROP COLUMN "businessId",
DROP COLUMN "endUserId";
