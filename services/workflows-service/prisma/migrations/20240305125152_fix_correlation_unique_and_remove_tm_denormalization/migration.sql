-- Remove TransactionRecord unique correlationId
DROP INDEX "TransactionRecord_transactionCorrelationId_key";

-- Remove TransactionRecord<>EndUser/Business denormalization
ALTER TABLE "TransactionRecord" DROP CONSTRAINT "TransactionRecord_businessId_fkey";
ALTER TABLE "TransactionRecord" DROP CONSTRAINT "TransactionRecord_endUserId_fkey";
ALTER TABLE "TransactionRecord" DROP COLUMN "businessId", DROP COLUMN "endUserId";

-- Fix EndUser/Business unique correlationId
CREATE UNIQUE INDEX "Business_projectId_correlationId_key" ON "Business"("projectId", "correlationId");
CREATE UNIQUE INDEX "EndUser_projectId_correlationId_key" ON "EndUser"("projectId", "correlationId");
DROP INDEX "Business_correlationId_key";
DROP INDEX "EndUser_correlationId_key";

-- Drop unnecessary Counterparty type
ALTER TABLE "Counterparty" DROP COLUMN "type";
DROP TYPE "CounterpartyType";
