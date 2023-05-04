-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "approvalState" SET DEFAULT 'NEW';

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "tasks" JSONB NOT NULL,
    "rulesSets" JSONB NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);
