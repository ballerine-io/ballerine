-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- AlterTable
ALTER TABLE "EndUser" ADD COLUMN     "address" JSONB,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "nationality" VARCHAR,
ADD COLUMN     "passportNumber" VARCHAR;
