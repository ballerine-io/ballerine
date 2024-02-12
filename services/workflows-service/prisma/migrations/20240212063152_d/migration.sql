/*
  Warnings:

  - You are about to drop the column `transactiondDirection` on the `TransactionRecord` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('Incoming', 'Outgoing');

-- AlterTable
ALTER TABLE "TransactionRecord" DROP COLUMN "transactiondDirection",
ADD COLUMN     "transactionDirection" "TransactionDirection";

-- DropEnum
DROP TYPE "transactiondDirection";
