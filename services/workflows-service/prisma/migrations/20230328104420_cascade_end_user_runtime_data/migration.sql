-- DropForeignKey
ALTER TABLE "WorkflowRuntimeData" DROP CONSTRAINT "WorkflowRuntimeData_endUserId_fkey";

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
