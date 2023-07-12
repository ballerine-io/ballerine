/*
  Warnings:

  - The `address` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "bankInformation" JSONB,
DROP COLUMN "address",
ADD COLUMN     "address" JSONB;

-- AlterTable
ALTER TABLE "EndUser" ADD COLUMN     "isContactPerson" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "endUserType" SET DEFAULT 'individual';
