/*
  Warnings:

  - The `paymentMethod` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('Inbound', 'Outbound');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'APN';

-- AlterTable
ALTER TABLE "TransactionRecord" ADD COLUMN     "transactionDirection" "TransactionDirection",
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT;

-- CreateIndex
CREATE INDEX "TransactionRecord_paymentMethod_idx" ON "TransactionRecord"("paymentMethod");
