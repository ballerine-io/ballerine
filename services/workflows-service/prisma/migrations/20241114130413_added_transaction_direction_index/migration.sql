DROP INDEX IF EXISTS "TransactionRecord_transactionDirection_idx";

-- CreateIndex
CREATE INDEX "TransactionRecord_transactionDirection_idx" ON "TransactionRecord"("transactionDirection");
