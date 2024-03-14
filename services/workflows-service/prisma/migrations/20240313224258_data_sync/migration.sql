-- CreateEnum
CREATE TYPE "DataSyncStatus" AS ENUM ('new', 'synced', 'unsynced', 'pending_approval', 'failed');

-- CreateEnum
CREATE TYPE "DataSyncTables" AS ENUM ('WorkflowDefinition', 'UiDefinition');

-- CreateTable
CREATE TABLE "DataSync" (
    "id" TEXT NOT NULL,
    "table" "DataSyncTables" NOT NULL,
    "crossEnvKey" TEXT NOT NULL,
    "fullDataHash" TEXT NOT NULL,
    "status" "DataSyncStatus" NOT NULL DEFAULT 'new',
    "diff" JSONB,
    "failureReason" TEXT,
    "auditLog" JSONB,
    "syncedColumns" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastRunAt" TIMESTAMP(3),
    "lastSyncAt" TIMESTAMP(3),

    CONSTRAINT "DataSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataSync_status_idx" ON "DataSync"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DataSync_table_crossEnvKey_key" ON "DataSync"("table", "crossEnvKey");
