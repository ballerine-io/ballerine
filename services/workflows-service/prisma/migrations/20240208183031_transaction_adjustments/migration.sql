/*
  Warnings:

  - You are about to drop the column `beneficiaryId` on the `TransactionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `originatorId` on the `TransactionRecord` table. All the data in the column will be lost.
  - The `reviewStatus` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Counterparty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `transactionBaseAmount` to the `TransactionRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionBaseCurrency` to the `TransactionRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ReviewStatus" ADD VALUE 'Rejected';

-- DropForeignKey
ALTER TABLE "TransactionRecord" DROP CONSTRAINT "TransactionRecord_beneficiaryId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionRecord" DROP CONSTRAINT "TransactionRecord_originatorId_fkey";

-- DropIndex
DROP INDEX "TransactionRecord_businessId_idx";

-- DropIndex
DROP INDEX "TransactionRecord_endUserId_idx";

-- AlterTable
ALTER TABLE "Counterparty" ADD COLUMN     "businessId" TEXT,
ADD COLUMN     "endUserId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "CounterpartyType" NOT NULL;

-- AlterTable
ALTER TABLE "TransactionRecord" DROP COLUMN "beneficiaryId",
DROP COLUMN "originatorId",
ADD COLUMN     "counterpartyBeneficiaryId" TEXT,
ADD COLUMN     "counterpartyOriginatorId" TEXT,
ADD COLUMN     "productSku" TEXT,
ADD COLUMN     "transactionBaseAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transactionBaseCurrency" TEXT NOT NULL,
ALTER COLUMN "transactionStatus" DROP NOT NULL,
DROP COLUMN "reviewStatus",
ADD COLUMN     "reviewStatus" "ReviewStatus";

-- CreateIndex
CREATE INDEX "TransactionRecord_reviewStatus_idx" ON "TransactionRecord"("reviewStatus");

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_counterpartyOriginatorId_fkey" FOREIGN KEY ("counterpartyOriginatorId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_counterpartyBeneficiaryId_fkey" FOREIGN KEY ("counterpartyBeneficiaryId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counterparty" ADD CONSTRAINT "Counterparty_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counterparty" ADD CONSTRAINT "Counterparty_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
