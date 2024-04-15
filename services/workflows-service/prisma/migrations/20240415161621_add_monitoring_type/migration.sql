-- CreateEnum
CREATE TYPE "MonitoringType" AS ENUM ('transaction_monitoring', 'ongoing_merchant_monitoring');

-- AlterTable with default in order to avoid the error for existing data
ALTER TABLE "AlertDefinition" ADD COLUMN     "monitoringType" "MonitoringType" NOT NULL DEFAULT 'transaction_monitoring';
