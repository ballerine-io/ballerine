/*
  Warnings:

  - A unique constraint covering the columns `[projectId,transactionCorrelationId]` on the table `TransactionRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TransactionRecord_projectId_transactionCorrelationId_key" ON "TransactionRecord"("projectId", "transactionCorrelationId");
