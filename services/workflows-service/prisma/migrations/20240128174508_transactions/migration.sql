-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Refund', 'Chargeback');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('Pending', 'Reviewed', 'Flagged', 'Cleared');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('Unverified', 'Verified', 'Pending');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('New', 'Pending', 'Active', 'Completed', 'Rejected', 'Cancelled', 'Failed');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionCorrelationId" VARCHAR NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "transactionAmount" DOUBLE PRECISION NOT NULL,
    "transactionCurrency" TEXT NOT NULL,
    "transactionDescription" TEXT,
    "transactionCategory" TEXT,
    "transactionType" "TransactionType",
    "transactionStatus" "TransactionStatus" NOT NULL DEFAULT 'Completed',
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

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionCorrelationId_key" ON "Transaction"("transactionCorrelationId");

-- CreateIndex
CREATE INDEX "Transaction_businessId_idx" ON "Transaction"("businessId");

-- CreateIndex
CREATE INDEX "Transaction_endUserId_idx" ON "Transaction"("endUserId");

-- CreateIndex
CREATE INDEX "Transaction_transactionType_idx" ON "Transaction"("transactionType");

-- CreateIndex
CREATE INDEX "Transaction_transactionDate_idx" ON "Transaction"("transactionDate");

-- CreateIndex
CREATE INDEX "Transaction_reviewStatus_idx" ON "Transaction"("reviewStatus");

-- CreateIndex
CREATE INDEX "Transaction_projectId_idx" ON "Transaction"("projectId");

-- CreateIndex
CREATE INDEX "Transaction_transactionCorrelationId_idx" ON "Transaction"("transactionCorrelationId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
