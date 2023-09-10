-- CreateTable
CREATE TABLE "WorkflowRuntimeDataToken" (
    "id" TEXT NOT NULL,
    "token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflowRuntimeDataId" TEXT NOT NULL,
    "endUserId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) NULL,

    CONSTRAINT "WorkflowRuntimeDataToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowRuntimeDataToken_token_key" ON "WorkflowRuntimeDataToken"("token");

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeDataToken" ADD CONSTRAINT "WorkflowRuntimeDataToken_workflowRuntimeDataId_fkey" FOREIGN KEY ("workflowRuntimeDataId") REFERENCES "WorkflowRuntimeData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeDataToken" ADD CONSTRAINT "WorkflowRuntimeDataToken_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeDataToken" ADD CONSTRAINT "WorkflowRuntimeDataToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
