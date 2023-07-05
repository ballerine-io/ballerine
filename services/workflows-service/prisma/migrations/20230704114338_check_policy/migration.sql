-- CreateEnum
CREATE TYPE "CheckPolicy" AS ENUM ('always', 'sometimes', 'never');

-- AlterTable
ALTER TABLE "WorkflowDefinition" ADD COLUMN     "autoEmitEvent" JSONB,
ADD COLUMN     "checkPolicy" "CheckPolicy" DEFAULT 'always',
ADD COLUMN     "policy" JSONB;
