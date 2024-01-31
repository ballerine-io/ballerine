-- CreateEnum
CREATE TYPE "TransactionRecordType" AS ENUM ('Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Refund', 'Chargeback');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('Pending', 'Reviewed', 'Flagged', 'Cleared');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('Unverified', 'Verified', 'Pending');

-- CreateEnum
CREATE TYPE "TransactionRecordStatus" AS ENUM ('New', 'Pending', 'Active', 'Completed', 'Rejected', 'Cancelled', 'Failed');

-- CreateEnum
CREATE TYPE "AlertState" AS ENUM ('Triggered', 'Resolved', 'Acknowledged', 'Dismissed', 'Escalated', 'UnderReview');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('New', 'Pending', 'Completed');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('HighRiskTransaction', 'DormantAccountActivity', 'UnusualPattern');

-- CreateTable
CREATE TABLE "TransactionRecord" (
    "id" TEXT NOT NULL,
    "transactionCorrelationId" VARCHAR NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "transactionAmount" DOUBLE PRECISION NOT NULL,
    "transactionCurrency" TEXT NOT NULL,
    "transactionDescription" TEXT,
    "transactionCategory" TEXT,
    "transactionType" "TransactionRecordType",
    "transactionStatus" "TransactionRecordStatus" NOT NULL DEFAULT 'Completed',
    "transactionStatusReason" TEXT,
    "senderAccountId" TEXT,
    "senderName" TEXT,
    "senderCorrelationId" TEXT,
    "senderCountry" TEXT,
    "senderIpAddress" TEXT,
    "senderGeoLocation" TEXT,
    "senderUserAgent" TEXT,
    "senderPEPStatus" TEXT,
    "senderSanctionListMatchStatus" TEXT,
    "senderVerificationStatus" "VerificationStatus",
    "recipientAccountId" TEXT,
    "recipientName" TEXT,
    "recipientCorrelationId" TEXT,
    "recipientCountry" TEXT,
    "recipientVerificationStatus" "VerificationStatus",
    "recipientSanctionListMatchStatus" TEXT,
    "recipientPEPStatus" TEXT,
    "paymentMethod" TEXT,
    "paymentType" TEXT,
    "paymentChannel" TEXT,
    "paymentIssuer" TEXT,
    "paymentGateway" TEXT,
    "paymentAcquirer" TEXT,
    "paymentProcessor" TEXT,
    "cardFingerprint" TEXT,
    "cardIssuedCountry" TEXT,
    "completed3ds" BOOLEAN,
    "cardType" TEXT,
    "cardIssuer" TEXT,
    "cardBrand" TEXT,
    "cardExpiryMonth" TEXT,
    "cardExpiryYear" TEXT,
    "cardHolderName" TEXT,
    "cardTokenized" TEXT,
    "tags" JSONB,
    "reviewStatus" TEXT,
    "reviewerComments" TEXT,
    "auditTrail" JSONB,
    "unusualActivityFlags" JSONB,
    "riskScore" DOUBLE PRECISION,
    "regulatoryAuthority" TEXT,
    "additionalInfo" JSONB,
    "productName" TEXT,
    "productDescription" TEXT,
    "productPrice" DOUBLE PRECISION,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT,
    "endUserId" TEXT,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "TransactionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertDefinition" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rulesetId" INTEGER NOT NULL,
    "ruleId" INTEGER NOT NULL,
    "inlineRule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "modifiedBy" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "type" "AlertType",
    "dedupeStrategies" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "tags" TEXT[],
    "additionalInfo" JSONB NOT NULL,
    "workflowDefinitionId" TEXT,

    CONSTRAINT "AlertDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertExecution" (
    "id" TEXT NOT NULL,
    "businessId" TEXT,
    "endUserId" TEXT,
    "projectId" TEXT NOT NULL,
    "dataTimestamp" TIMESTAMP(3) NOT NULL,
    "state" "AlertState" NOT NULL,
    "status" "AlertStatus" NOT NULL,
    "tags" TEXT[],
    "alertDefinitionId" TEXT NOT NULL,
    "executionDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "handledBy" TEXT,
    "workflowRuntimeDataId" TEXT,

    CONSTRAINT "AlertExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionRecord_transactionCorrelationId_key" ON "TransactionRecord"("transactionCorrelationId");

-- CreateIndex
CREATE INDEX "TransactionRecord_businessId_idx" ON "TransactionRecord"("businessId");

-- CreateIndex
CREATE INDEX "TransactionRecord_endUserId_idx" ON "TransactionRecord"("endUserId");

-- CreateIndex
CREATE INDEX "TransactionRecord_transactionType_idx" ON "TransactionRecord"("transactionType");

-- CreateIndex
CREATE INDEX "TransactionRecord_transactionDate_idx" ON "TransactionRecord"("transactionDate");

-- CreateIndex
CREATE INDEX "TransactionRecord_reviewStatus_idx" ON "TransactionRecord"("reviewStatus");

-- CreateIndex
CREATE INDEX "TransactionRecord_projectId_idx" ON "TransactionRecord"("projectId");

-- CreateIndex
CREATE INDEX "TransactionRecord_transactionCorrelationId_idx" ON "TransactionRecord"("transactionCorrelationId");

-- CreateIndex
CREATE INDEX "AlertDefinition_projectId_idx" ON "AlertDefinition"("projectId");

-- CreateIndex
CREATE INDEX "AlertExecution_businessId_idx" ON "AlertExecution"("businessId");

-- CreateIndex
CREATE INDEX "AlertExecution_endUserId_idx" ON "AlertExecution"("endUserId");

-- CreateIndex
CREATE INDEX "AlertExecution_projectId_idx" ON "AlertExecution"("projectId");

-- CreateIndex
CREATE INDEX "AlertExecution_alertDefinitionId_idx" ON "AlertExecution"("alertDefinitionId");

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertDefinition" ADD CONSTRAINT "AlertDefinition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertExecution" ADD CONSTRAINT "AlertExecution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertExecution" ADD CONSTRAINT "AlertExecution_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertExecution" ADD CONSTRAINT "AlertExecution_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertExecution" ADD CONSTRAINT "AlertExecution_alertDefinitionId_fkey" FOREIGN KEY ("alertDefinitionId") REFERENCES "AlertDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
