-- CreateIndex
CREATE INDEX "TransactionRecord_transactionDirection_idx" ON "TransactionRecord"("transactionDirection");

CREATE INDEX "TransactionRecord_transactionDate_desc_idx" ON "TransactionRecord"("transactionDate" DESC);
