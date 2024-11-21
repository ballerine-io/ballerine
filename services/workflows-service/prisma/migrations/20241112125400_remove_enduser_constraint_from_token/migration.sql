-- DropForeignKey
ALTER TABLE "WorkflowRuntimeDataToken" DROP CONSTRAINT "WorkflowRuntimeDataToken_endUserId_fkey";

-- AlterTable
ALTER TABLE "WorkflowRuntimeDataToken" ALTER COLUMN "endUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeDataToken" ADD CONSTRAINT "WorkflowRuntimeDataToken_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
