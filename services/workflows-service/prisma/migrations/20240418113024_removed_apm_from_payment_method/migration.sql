-- AlterEnum
BEGIN;
UPDATE "TransactionRecord" SET "paymentMethod"='apple_pay' WHERE "paymentMethod"='apn';
COMMIT;

BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('credit_card', 'debit_card', 'bank_transfer', 'pay_pal', 'apple_pay', 'google_pay');
ALTER TABLE "TransactionRecord" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
COMMIT;
