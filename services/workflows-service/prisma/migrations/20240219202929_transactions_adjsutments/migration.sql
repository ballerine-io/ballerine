/*
  Warnings:

  - You are about to drop the column `bankCountry` on the `Counterparty` table. All the data in the column will be lost.
  - You are about to drop the column `sortCode` on the `Counterparty` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,correlationId]` on the table `Counterparty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,transactionCorrelationId]` on the table `TransactionRecord` will be added. If there are existing duplicate values, this will fail.
  - Made the column `inlineRule` on table `AlertDefinition` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentBrandName" AS ENUM ('VISA', 'MASTERCARD', 'DCI', 'SCB_PayNow', 'OCBC_PayNow', 'Atome', 'Dash', 'GrabPay', 'AlipayHost', 'WechatHost');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('Inbound', 'Outbound');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AlertState" ADD VALUE '304';
ALTER TYPE "AlertState" ADD VALUE '305';

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'APN';

-- AlterTable
ALTER TABLE "AlertDefinition" ALTER COLUMN "inlineRule" SET NOT NULL,
ALTER COLUMN "modifiedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "mccCode" INTEGER;

-- AlterTable
ALTER TABLE "Counterparty" DROP COLUMN "bankCountry",
DROP COLUMN "sortCode";

-- AlterTable
ALTER TABLE "TransactionRecord" ADD COLUMN     "originatorBankCountry" TEXT,
ADD COLUMN     "originatorSortCode" TEXT,
ADD COLUMN     "paymentBrandName" "PaymentBrandName",
ADD COLUMN     "transactionDirection" "TransactionDirection",
ADD COLUMN     "transactionReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Counterparty_projectId_correlationId_key" ON "Counterparty"("projectId", "correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionRecord_projectId_transactionCorrelationId_key" ON "TransactionRecord"("projectId", "transactionCorrelationId");
