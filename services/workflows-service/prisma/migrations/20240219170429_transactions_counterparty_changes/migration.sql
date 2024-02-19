/*
  Warnings:

  - You are about to drop the column `bankCountry` on the `Counterparty` table. All the data in the column will be lost.
  - You are about to drop the column `sortCode` on the `Counterparty` table. All the data in the column will be lost.
  - Made the column `inlineRule` on table `AlertDefinition` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AlertDefinition" ALTER COLUMN "inlineRule" SET NOT NULL,
ALTER COLUMN "modifiedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Counterparty" DROP COLUMN "bankCountry",
DROP COLUMN "sortCode";

-- AlterTable
ALTER TABLE "TransactionRecord" ADD COLUMN     "originatorBankCountry" TEXT,
ADD COLUMN     "originatorSortCode" TEXT;
