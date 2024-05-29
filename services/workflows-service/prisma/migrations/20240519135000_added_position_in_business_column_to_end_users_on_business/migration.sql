-- CreateEnum
CREATE TYPE "BusinessPosition" AS ENUM ('ubo', 'director', 'representative', 'authorized_signatory');

-- AlterTable
ALTER TABLE "EndUsersOnBusinesses" ADD COLUMN     "position" "BusinessPosition"[];
