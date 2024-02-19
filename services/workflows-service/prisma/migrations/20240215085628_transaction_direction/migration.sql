-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('Inbound', 'Outbound');

-- AlterTable
ALTER TABLE "TransactionRecord" ADD COLUMN     "transactionDirection" "TransactionDirection";
