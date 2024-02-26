-- CreateEnum
CREATE TYPE "TransactionRecordType" AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment', 'refund', 'chargeback');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'reviewed', 'flagged', 'cleared', 'rejected');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('unverified', 'verified', 'pending');

-- CreateEnum
CREATE TYPE "TransactionRecordStatus" AS ENUM ('new', 'pending', 'active', 'completed', 'rejected', 'cancelled', 'failed');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('credit_card', 'debit_card', 'bank_transfer', 'pay_pal', 'apple_pay', 'google_pay', 'apn');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('instant', 'scheduled', 'recurring', 'refund');

-- CreateEnum
CREATE TYPE "PaymentChannel" AS ENUM ('online', 'mobile_app', 'in_store', 'telephone', 'mail_order');

-- CreateEnum
CREATE TYPE "PaymentIssuer" AS ENUM ('chase', 'bank_of_america', 'citibank', 'american_express');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('stripe', 'pay_pal', 'square', 'adyen');

-- CreateEnum
CREATE TYPE "PaymentAcquirer" AS ENUM ('wells_fargo', 'first_data', 'elavon', 'world_pay');

-- CreateEnum
CREATE TYPE "PaymentProcessor" AS ENUM ('visa', 'master_card', 'discover', 'american_express');

-- CreateEnum
CREATE TYPE "PaymentBrandName" AS ENUM ('visa', 'mastercard', 'dci', 'scb_pay_now', 'ocbc_pay_now', 'atome', 'dash', 'grab_pay', 'alipay_host', 'wechat_host');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('100', '200', '300', '400');

-- CreateEnum
CREATE TYPE "AlertState" AS ENUM ('101', '201', '202', '301', '302', '303', '304', '305');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('100', '200', '300');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('HighRiskTransaction', 'DormantAccountActivity', 'UnusualPattern');

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
ALTER TABLE "Business" ADD COLUMN     "mccCode" INTEGER;

-- CreateTable
CREATE TABLE "TransactionRecord" (
    "id" TEXT NOT NULL,
    "transactionCorrelationId" VARCHAR NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "transactionAmount" DOUBLE PRECISION NOT NULL,
    "transactionCurrency" TEXT NOT NULL,
    "transactionBaseAmount" DOUBLE PRECISION NOT NULL,
    "transactionBaseCurrency" TEXT NOT NULL,
    "transactionDescription" TEXT,
    "transactionCategory" TEXT,
    "transactionType" "TransactionRecordType",
    "transactionStatus" "TransactionRecordStatus" DEFAULT 'completed',
    "transactionStatusReason" TEXT,
    "transactionDirection" "TransactionDirection",
    "transactionReference" TEXT,
    "originatorIpAddress" TEXT,
    "originatorGeoLocation" TEXT,
    "originatorUserAgent" TEXT,
    "originatorSortCode" TEXT,
    "originatorBankCountry" TEXT,
    "paymentBrandName" "PaymentBrandName",
    "paymentMethod" "PaymentMethod",
    "paymentType" "PaymentType",
    "paymentChannel" "PaymentChannel",
    "paymentIssuer" "PaymentIssuer",
    "paymentGateway" "PaymentGateway",
    "paymentAcquirer" "PaymentAcquirer",
    "paymentProcessor" "PaymentProcessor",
    "cardFingerprint" TEXT,
    "cardIssuedCountry" TEXT,
    "completed3ds" BOOLEAN,
    "cardType" TEXT,
    "cardIssuer" TEXT,
    "cardBin" INTEGER,
    "cardBrand" TEXT,
    "cardExpiryMonth" TEXT,
    "cardExpiryYear" TEXT,
    "cardHolderName" TEXT,
    "cardTokenized" TEXT,
    "tags" JSONB,
    "reviewStatus" "ReviewStatus",
    "reviewerComments" TEXT,
    "auditTrail" JSONB,
    "unusualActivityFlags" JSONB,
    "riskScore" DOUBLE PRECISION,
    "regulatoryAuthority" TEXT,
    "additionalInfo" JSONB,
    "productName" TEXT,
    "productDescription" TEXT,
    "productPrice" DOUBLE PRECISION,
    "productPriceCurrency" TEXT,
    "productId" TEXT,
    "productSku" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "counterpartyOriginatorId" TEXT,
    "counterpartyBeneficiaryId" TEXT,
    "endUserId" TEXT,
    "businessId" TEXT,

    CONSTRAINT "TransactionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertDefinition" (
    "id" TEXT NOT NULL,
    "type" "AlertType",
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    "rulesetId" TEXT,
    "ruleId" TEXT,
    "inlineRule" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',
    "dedupeStrategies" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "defaultSeverity" "AlertSeverity" NOT NULL,
    "tags" TEXT[],
    "additionalInfo" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "alertDefinitionId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "businessId" TEXT,
    "endUserId" TEXT,
    "dataTimestamp" TIMESTAMP(3) NOT NULL,
    "state" "AlertState" NOT NULL,
    "status" "AlertStatus" NOT NULL,
    "tags" TEXT[],
    "severity" "AlertSeverity",
    "executionDetails" JSONB NOT NULL,
    "assigneeId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workflowRuntimeDataId" TEXT,
    "counterpartyId" TEXT,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counterparty" (
    "id" TEXT NOT NULL,
    "correlationId" TEXT,
    "type" "CounterpartyType" NOT NULL,
    "additionalInfo" JSONB,
    "businessId" TEXT,
    "endUserId" TEXT,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionRecord_transactionCorrelationId_key" ON "TransactionRecord"("transactionCorrelationId");

-- CreateIndex
CREATE INDEX "TransactionRecord_transactionType_idx" ON "TransactionRecord"("transactionType");

-- CreateIndex
CREATE INDEX "TransactionRecord_transactionDate_idx" ON "TransactionRecord"("transactionDate");

-- CreateIndex
CREATE INDEX "TransactionRecord_transactionStatus_idx" ON "TransactionRecord"("transactionStatus");

-- CreateIndex
CREATE INDEX "TransactionRecord_reviewStatus_idx" ON "TransactionRecord"("reviewStatus");

-- CreateIndex
CREATE INDEX "TransactionRecord_projectId_idx" ON "TransactionRecord"("projectId");

-- CreateIndex
CREATE INDEX "TransactionRecord_transactionCorrelationId_idx" ON "TransactionRecord"("transactionCorrelationId");

-- CreateIndex
CREATE INDEX "TransactionRecord_counterpartyOriginatorId_idx" ON "TransactionRecord"("counterpartyOriginatorId");

-- CreateIndex
CREATE INDEX "TransactionRecord_counterpartyBeneficiaryId_idx" ON "TransactionRecord"("counterpartyBeneficiaryId");

-- CreateIndex
CREATE INDEX "TransactionRecord_paymentMethod_idx" ON "TransactionRecord"("paymentMethod");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionRecord_projectId_transactionCorrelationId_key" ON "TransactionRecord"("projectId", "transactionCorrelationId");

-- CreateIndex
CREATE INDEX "AlertDefinition_projectId_idx" ON "AlertDefinition"("projectId");

-- CreateIndex
CREATE INDEX "Alert_assigneeId_idx" ON "Alert"("assigneeId");

-- CreateIndex
CREATE INDEX "Alert_businessId_idx" ON "Alert"("businessId");

-- CreateIndex
CREATE INDEX "Alert_endUserId_idx" ON "Alert"("endUserId");

-- CreateIndex
CREATE INDEX "Alert_projectId_idx" ON "Alert"("projectId");

-- CreateIndex
CREATE INDEX "Alert_alertDefinitionId_idx" ON "Alert"("alertDefinitionId");

-- CreateIndex
CREATE INDEX "Alert_counterpartyId_idx" ON "Alert"("counterpartyId");

-- CreateIndex
CREATE INDEX "Counterparty_correlationId_idx" ON "Counterparty"("correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "Counterparty_projectId_correlationId_key" ON "Counterparty"("projectId", "correlationId");

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_counterpartyOriginatorId_fkey" FOREIGN KEY ("counterpartyOriginatorId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_counterpartyBeneficiaryId_fkey" FOREIGN KEY ("counterpartyBeneficiaryId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertDefinition" ADD CONSTRAINT "AlertDefinition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_alertDefinitionId_fkey" FOREIGN KEY ("alertDefinitionId") REFERENCES "AlertDefinition"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_workflowRuntimeDataId_fkey" FOREIGN KEY ("workflowRuntimeDataId") REFERENCES "WorkflowRuntimeData"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counterparty" ADD CONSTRAINT "Counterparty_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counterparty" ADD CONSTRAINT "Counterparty_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counterparty" ADD CONSTRAINT "Counterparty_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
