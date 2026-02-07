-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "DocumentFile" ADD COLUMN     "deletedAt" TIMESTAMP(3);
