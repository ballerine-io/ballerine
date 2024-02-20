-- AlterTable
ALTER TABLE "AlertDefinition" ALTER COLUMN "rulesetId" DROP NOT NULL,
ALTER COLUMN "rulesetId" SET DATA TYPE TEXT,
ALTER COLUMN "ruleId" DROP NOT NULL,
ALTER COLUMN "ruleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TransactionRecord" ADD COLUMN     "cardBIN" INTEGER,
ADD COLUMN     "productPriceCurrency" TEXT;
