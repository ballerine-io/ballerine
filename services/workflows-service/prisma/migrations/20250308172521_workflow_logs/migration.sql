-- CreateEnum
CREATE TYPE "WorkflowLogType" AS ENUM ('EVENT_RECEIVED', 'STATE_TRANSITION', 'PLUGIN_INVOCATION', 'CONTEXT_CHANGED', 'ERROR', 'INFO');

-- CreateTable
CREATE TABLE "WorkflowLog" (
    "id" SERIAL NOT NULL,
    "workflowRuntimeDataId" TEXT NOT NULL,
    "type" "WorkflowLogType" NOT NULL,
    "metadata" JSONB,
    "fromState" TEXT,
    "toState" TEXT,
    "message" TEXT,
    "eventName" TEXT,
    "pluginName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "WorkflowLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkflowLog_workflowRuntimeDataId_idx" ON "WorkflowLog"("workflowRuntimeDataId");

-- CreateIndex
CREATE INDEX "WorkflowLog_type_idx" ON "WorkflowLog"("type");

-- CreateIndex
CREATE INDEX "WorkflowLog_createdAt_idx" ON "WorkflowLog"("createdAt");

-- CreateIndex
CREATE INDEX "WorkflowLog_projectId_idx" ON "WorkflowLog"("projectId");

-- AddForeignKey
ALTER TABLE "WorkflowLog" ADD CONSTRAINT "WorkflowLog_workflowRuntimeDataId_fkey" FOREIGN KEY ("workflowRuntimeDataId") REFERENCES "WorkflowRuntimeData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowLog" ADD CONSTRAINT "WorkflowLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
