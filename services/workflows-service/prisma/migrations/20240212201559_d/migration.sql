/*
  Warnings:

  - The `paymentMethod` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TransactionRecord" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT;

-- CreateIndex
CREATE INDEX "TransactionRecord_paymentMethod_idx" ON "TransactionRecord"("paymentMethod");
