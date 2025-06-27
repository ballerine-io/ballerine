-- CreateEnum
CREATE TYPE "EndUserVariant" AS ENUM ('director', 'ubo');

-- AlterTable
ALTER TABLE "EndUser" ADD COLUMN     "variant" "EndUserVariant";
