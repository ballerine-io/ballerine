-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "decisionAt" TIMESTAMP(3),
ADD COLUMN     "dedupedAt" TIMESTAMP(3);