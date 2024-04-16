/*
  Warnings:

  - You are about to drop the column `businessId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `counterpartyId` on the `Alert` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ongoingMarchentAlertId]` on the table `Alert` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionAlertId]` on the table `Alert` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_counterpartyId_fkey";

-- DropIndex
DROP INDEX "Alert_counterpartyId_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "businessId",
DROP COLUMN "counterpartyId",
ADD COLUMN     "ongoingMarchentAlertId" TEXT,
ADD COLUMN     "transactionAlertId" TEXT;

-- CreateTable
CREATE TABLE "OngoingMarchentAlert" (
    "id" TEXT NOT NULL,
    "businessId" TEXT,
    "businessReportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OngoingMarchentAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionAlert" (
    "id" TEXT NOT NULL,
    "counterpartyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OngoingMarchentAlert_businessReportId_key" ON "OngoingMarchentAlert"("businessReportId");

-- CreateIndex
CREATE UNIQUE INDEX "Alert_ongoingMarchentAlertId_key" ON "Alert"("ongoingMarchentAlertId");

-- CreateIndex
CREATE UNIQUE INDEX "Alert_transactionAlertId_key" ON "Alert"("transactionAlertId");

-- AddForeignKey
ALTER TABLE "OngoingMarchentAlert" ADD CONSTRAINT "OngoingMarchentAlert_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OngoingMarchentAlert" ADD CONSTRAINT "OngoingMarchentAlert_businessReportId_fkey" FOREIGN KEY ("businessReportId") REFERENCES "BusinessReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionAlert" ADD CONSTRAINT "TransactionAlert_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_ongoingMarchentAlertId_fkey" FOREIGN KEY ("ongoingMarchentAlertId") REFERENCES "OngoingMarchentAlert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_transactionAlertId_fkey" FOREIGN KEY ("transactionAlertId") REFERENCES "TransactionAlert"("id") ON DELETE SET NULL ON UPDATE CASCADE;
