-- Create the enum
CREATE TYPE "WorkflowRuntimeDataStatus" AS ENUM ('created', 'completed');

-- Change the column type to enum
ALTER TABLE "WorkflowRuntimeData" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "WorkflowRuntimeData" ALTER COLUMN "status" TYPE "WorkflowRuntimeDataStatus" USING "status"::"WorkflowRuntimeDataStatus";
ALTER TABLE "WorkflowRuntimeData" ALTER COLUMN "status" SET DEFAULT 'created';
