/*
  Warnings:

  - The `paymentMethod` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[projectId,transactionCorrelationId]` on the table `TransactionRecord` will be added. If there are existing duplicate values, this will fail.

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

-- CreateIndex
CREATE UNIQUE INDEX "TransactionRecord_projectId_transactionCorrelationId_key" ON "TransactionRecord"("projectId", "transactionCorrelationId");
