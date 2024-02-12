/*
  Warnings:

  - The values [Incoming,Outgoing] on the enum `TransactionDirection` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionDirection_new" AS ENUM ('Inbound', 'Outbound');
ALTER TABLE "TransactionRecord" ALTER COLUMN "transactionDirection" TYPE "TransactionDirection_new" USING ("transactionDirection"::text::"TransactionDirection_new");
ALTER TYPE "TransactionDirection" RENAME TO "TransactionDirection_old";
ALTER TYPE "TransactionDirection_new" RENAME TO "TransactionDirection";
DROP TYPE "TransactionDirection_old";
COMMIT;
