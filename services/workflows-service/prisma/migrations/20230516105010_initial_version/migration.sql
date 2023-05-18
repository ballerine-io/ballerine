-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "correlationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EndUser" ALTER COLUMN "correlationId" DROP NOT NULL;
