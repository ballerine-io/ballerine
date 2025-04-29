-- AlterTable
ALTER TABLE "WorkflowRuntimeData" ADD COLUMN     "actorEndUserId" TEXT,
ADD COLUMN     "actorUserId" TEXT;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_actorEndUserId_fkey" FOREIGN KEY ("actorEndUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
