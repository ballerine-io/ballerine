-- DropForeignKey
ALTER TABLE "WorkflowRuntimeData" DROP CONSTRAINT "WorkflowRuntimeData_endUserId_fkey";

-- AlterTable
ALTER TABLE "WorkflowRuntimeData" ALTER COLUMN "endUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
