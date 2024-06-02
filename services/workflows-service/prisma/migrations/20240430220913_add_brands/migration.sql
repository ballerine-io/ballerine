/*
  Warnings:

  - The values [dci] on the enum `PaymentBrandName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentBrandName_new" AS ENUM ('visa', 'mastercard', 'diners', 'jcb', 'discover', 'china_union_pay', 'american_express', 'scb_pay_now', 'ocbc_pay_now', 'atome', 'dash', 'grab_pay', 'alipay_host', 'wechat_host');
ALTER TABLE "TransactionRecord" ALTER COLUMN "paymentBrandName" TYPE "PaymentBrandName_new" USING ("paymentBrandName"::text::"PaymentBrandName_new");
ALTER TYPE "PaymentBrandName" RENAME TO "PaymentBrandName_old";
ALTER TYPE "PaymentBrandName_new" RENAME TO "PaymentBrandName";
DROP TYPE "PaymentBrandName_old";
COMMIT;
