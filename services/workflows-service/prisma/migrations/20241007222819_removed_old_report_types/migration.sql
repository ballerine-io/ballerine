/*
  Warnings:

  - The values [ONGOING_MERCHANT_REPORT_T2,MERCHANT_REPORT_T2] on the enum `BusinessReportType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BusinessReportType_new" AS ENUM ('ONGOING_MERCHANT_REPORT_T1', 'MERCHANT_REPORT_T1', 'MERCHANT_REPORT_T1_LITE');
ALTER TABLE "BusinessReport" ALTER COLUMN "type" TYPE "BusinessReportType_new" USING ("type"::text::"BusinessReportType_new");
ALTER TYPE "BusinessReportType" RENAME TO "BusinessReportType_old";
ALTER TYPE "BusinessReportType_new" RENAME TO "BusinessReportType";
DROP TYPE "BusinessReportType_old";
COMMIT;
