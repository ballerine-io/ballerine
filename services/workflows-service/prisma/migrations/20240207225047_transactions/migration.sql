/*
  Warnings:

  - You are about to drop the column `recipientAccountId` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recipientCorrelationId` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recipientCountry` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recipientName` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recipientPEPStatus` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recipientSanctionListMatchStatus` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recipientVerificationStatus` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderAccountId` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderCorrelationId` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderCountry` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderGeoLocation` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderIpAddress` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderPEPStatus` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderSanctionListMatchStatus` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderUserAgent` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `senderVerificationStatus` on the `TransactionRecord` table. All the data in the column will be lost.
  - The `paymentMethod` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentType` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentChannel` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentIssuer` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentGateway` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentAcquirer` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentProcessor` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CreditCard', 'DebitCard', 'BankTransfer', 'PayPal', 'ApplePay', 'GooglePay');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Instant', 'Scheduled', 'Recurring', 'Refund');

-- CreateEnum
CREATE TYPE "PaymentChannel" AS ENUM ('Online', 'MobileApp', 'InStore', 'Telephone', 'MailOrder');

-- CreateEnum
CREATE TYPE "PaymentIssuer" AS ENUM ('Chase', 'BankOfAmerica', 'Citibank', 'AmericanExpress');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('Stripe', 'PayPal', 'Square', 'Adyen');

-- CreateEnum
CREATE TYPE "PaymentAcquirer" AS ENUM ('WellsFargo', 'FirstData', 'Elavon', 'WorldPay');

-- CreateEnum
CREATE TYPE "PaymentProcessor" AS ENUM ('Visa', 'MasterCard', 'Discover', 'AmericanExpress');

-- CreateEnum
CREATE TYPE "CounterpartyType" AS ENUM ('Individual', 'Company', 'Government', 'NonProfit');

-- CreateEnum
CREATE TYPE "RiskCategory" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('Compliant', 'NonCompliant', 'UnderReview');

-- CreateEnum
CREATE TYPE "PEPStatus" AS ENUM ('NotApplicable', 'PendingReview', 'Confirmed');

-- CreateEnum
CREATE TYPE "SanctionListMatchStatus" AS ENUM ('NotListed', 'PendingReview', 'Listed');

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "counterpartyId" TEXT;

-- AlterTable
ALTER TABLE "TransactionRecord" DROP COLUMN "recipientAccountId",
DROP COLUMN "recipientCorrelationId",
DROP COLUMN "recipientCountry",
DROP COLUMN "recipientName",
DROP COLUMN "recipientPEPStatus",
DROP COLUMN "recipientSanctionListMatchStatus",
DROP COLUMN "recipientVerificationStatus",
DROP COLUMN "senderAccountId",
DROP COLUMN "senderCorrelationId",
DROP COLUMN "senderCountry",
DROP COLUMN "senderGeoLocation",
DROP COLUMN "senderIpAddress",
DROP COLUMN "senderName",
DROP COLUMN "senderPEPStatus",
DROP COLUMN "senderSanctionListMatchStatus",
DROP COLUMN "senderUserAgent",
DROP COLUMN "senderVerificationStatus",
ADD COLUMN     "beneficiaryId" TEXT,
ADD COLUMN     "originatorGeoLocation" TEXT,
ADD COLUMN     "originatorId" TEXT,
ADD COLUMN     "originatorIpAddress" TEXT,
ADD COLUMN     "originatorUserAgent" TEXT,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod",
DROP COLUMN "paymentType",
ADD COLUMN     "paymentType" "PaymentType",
DROP COLUMN "paymentChannel",
ADD COLUMN     "paymentChannel" "PaymentChannel",
DROP COLUMN "paymentIssuer",
ADD COLUMN     "paymentIssuer" "PaymentIssuer",
DROP COLUMN "paymentGateway",
ADD COLUMN     "paymentGateway" "PaymentGateway",
DROP COLUMN "paymentAcquirer",
ADD COLUMN     "paymentAcquirer" "PaymentAcquirer",
DROP COLUMN "paymentProcessor",
ADD COLUMN     "paymentProcessor" "PaymentProcessor";

-- CreateTable
CREATE TABLE "Counterparty" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "email" TEXT,
    "phone" VARCHAR,
    "correlationId" TEXT,
    "type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "PEPStatus" "PEPStatus",
    "sanctionListMatchStatus" "SanctionListMatchStatus",
    "verificationStatus" "VerificationStatus",
    "sortCode" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "bankCountry" TEXT,
    "state" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "riskScore" DOUBLE PRECISION,
    "monitoringStatus" BOOLEAN NOT NULL DEFAULT true,
    "lastRiskScoreUpdate" TIMESTAMP(3),
    "complianceStatus" "ComplianceStatus",

    CONSTRAINT "Counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Counterparty_country_idx" ON "Counterparty"("country");

-- CreateIndex
CREATE INDEX "Counterparty_correlationId_idx" ON "Counterparty"("correlationId");

-- CreateIndex
CREATE INDEX "Counterparty_email_idx" ON "Counterparty"("email");

-- CreateIndex
CREATE INDEX "Alert_counterpartyId_idx" ON "Alert"("counterpartyId");

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_originatorId_fkey" FOREIGN KEY ("originatorId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
