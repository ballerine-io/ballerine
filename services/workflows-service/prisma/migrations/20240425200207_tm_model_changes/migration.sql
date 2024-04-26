/*
  Warnings:

  - The `paymentChannel` column on the `TransactionRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TransactionRecord" ADD COLUMN     "paymentMccCode" INTEGER,
DROP COLUMN "paymentChannel",
ADD COLUMN     "paymentChannel" TEXT;

-- DropEnum
DROP TYPE "PaymentChannel";
