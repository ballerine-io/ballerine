-- CreateEnum
CREATE TYPE "BusinessPosition" AS ENUM ('ubo', 'director', 'authorized_signatory');

-- AlterTable
ALTER TABLE "EndUsersOnBusinesses" ADD COLUMN     "positionInBusiness" "BusinessPosition"[];
