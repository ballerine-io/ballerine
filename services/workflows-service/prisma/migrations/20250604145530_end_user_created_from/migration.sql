-- CreateEnum
CREATE TYPE "CreatedFrom" AS ENUM ('analyst', 'user', 'registry');

-- AlterTable
ALTER TABLE "EndUser" ADD COLUMN     "createdFrom" "CreatedFrom";
