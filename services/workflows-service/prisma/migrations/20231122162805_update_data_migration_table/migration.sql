/*
  Warnings:

  - You are about to drop the column `success` on the `DataMigrationVersion` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DataVersionStatus" AS ENUM ('completed', 'failed');

-- DropIndex
DROP INDEX "DataMigrationVersion_success_version_idx";

-- DropIndex
DROP INDEX "DataMigrationVersion_version_key";

-- AlterTable
ALTER TABLE "DataMigrationVersion" DROP COLUMN "success",
ADD COLUMN     "status" "DataVersionStatus" NOT NULL DEFAULT 'completed';

-- CreateIndex
CREATE INDEX "DataMigrationVersion_status_version_idx" ON "DataMigrationVersion"("status", "version");

CREATE UNIQUE INDEX unique_version_on_completed ON "DataMigrationVersion" (version) WHERE status = 'completed';
