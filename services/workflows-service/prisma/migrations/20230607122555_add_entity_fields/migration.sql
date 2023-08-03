/*
  Warnings:

  - You are about to drop the column `jsonData` on the `EndUser` table. All the data in the column will be lost.
  - You are about to drop the column `verificationId` on the `EndUser` table. All the data in the column will be lost.
  - Made the column `firstName` on table `EndUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `EndUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "additionalInfo" JSONB,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "country" TEXT;

-- AlterTable
ALTER TABLE "EndUser" DROP COLUMN "jsonData",
DROP COLUMN "verificationId",
ADD COLUMN     "country" VARCHAR,
ADD COLUMN     "nationalId" VARCHAR,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;
