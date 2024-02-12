-- CreateEnum
CREATE TYPE "transactiondDirection" AS ENUM ('Incoming', 'Outgoing');

-- AlterTable
ALTER TABLE "TransactionRecord" ADD COLUMN     "transactiondDirection" "transactiondDirection";
