-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "definitionConfigs" JSONB,
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "definitionConfigs" JSONB,
ADD COLUMN     "features" JSONB;
