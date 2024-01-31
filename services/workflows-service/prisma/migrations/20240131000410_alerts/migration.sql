-- CreateEnum
CREATE TYPE "AlertState" AS ENUM ('Triggered', 'Resolved', 'Acknowledged', 'Dismissed');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('Pending', 'Completed', 'UnderReview', 'Escalated');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('HighRiskTransaction', 'DormantAccountActivity', 'UnusualPattern');

-- CreateTable
CREATE TABLE "AlertDefinition" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rulesetId" INTEGER NOT NULL,
    "ruleId" INTEGER NOT NULL,
    "inlineRule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "modifiedBy" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "type" "AlertType",
    "dedupeStrategies" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "tags" TEXT[],
    "additionalInfo" JSONB NOT NULL,
    "workflowDefinitionId" TEXT,

    CONSTRAINT "AlertDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertExecution" (
    "id" TEXT NOT NULL,
    "businessId" TEXT,
    "endUserId" TEXT,
    "projectId" TEXT NOT NULL,
    "dataTimestamp" TIMESTAMP(3) NOT NULL,
    "state" "AlertState" NOT NULL,
    "status" "AlertStatus" NOT NULL,
    "alertDefinitionId" TEXT NOT NULL,
    "executionDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "handledBy" TEXT,
    "workflowRuntimeDataId" TEXT,

    CONSTRAINT "AlertExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlertDefinition_projectId_idx" ON "AlertDefinition"("projectId");

-- CreateIndex
CREATE INDEX "AlertExecution_businessId_idx" ON "AlertExecution"("businessId");

-- CreateIndex
CREATE INDEX "AlertExecution_endUserId_idx" ON "AlertExecution"("endUserId");

-- CreateIndex
CREATE INDEX "AlertExecution_projectId_idx" ON "AlertExecution"("projectId");

-- CreateIndex
CREATE INDEX "AlertExecution_alertDefinitionId_idx" ON "AlertExecution"("alertDefinitionId");

-- AddForeignKey
ALTER TABLE "AlertDefinition" ADD CONSTRAINT "AlertDefinition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertExecution" ADD CONSTRAINT "AlertExecution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertExecution" ADD CONSTRAINT "AlertExecution_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertExecution" ADD CONSTRAINT "AlertExecution_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertExecution" ADD CONSTRAINT "AlertExecution_alertDefinitionId_fkey" FOREIGN KEY ("alertDefinitionId") REFERENCES "AlertDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
