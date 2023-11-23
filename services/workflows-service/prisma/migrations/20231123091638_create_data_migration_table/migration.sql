-- CreateEnum
CREATE TYPE "DataVersionStatus" AS ENUM ('in_progress', 'completed', 'failed');

-- CreateTable
CREATE TABLE "DataMigrationVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "migratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "DataVersionStatus" NOT NULL DEFAULT 'completed',
    "failureReason" TEXT,

    CONSTRAINT "DataMigrationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataMigrationVersion_migratedAt_idx" ON "DataMigrationVersion"("migratedAt");

-- CreateIndex
CREATE INDEX "DataMigrationVersion_status_version_idx" ON "DataMigrationVersion"("status", "version");
