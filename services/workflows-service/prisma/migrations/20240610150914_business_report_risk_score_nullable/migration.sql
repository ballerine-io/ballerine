-- AlterEnum
ALTER TYPE "BusinessReportStatus" ADD VALUE 'new';

-- AlterTable
ALTER TABLE "BusinessReport" ALTER COLUMN "reportId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BusinessReport" ALTER COLUMN "riskScore" DROP NOT NULL;
