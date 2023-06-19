-- CreateEnum
CREATE TYPE "ApprovalState" AS ENUM ('APPROVED', 'REJECTED', 'PROCESSING', 'NEW');

-- CreateEnum
CREATE TYPE "WorkflowRuntimeDataStatus" AS ENUM ('active', 'completed', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "roles" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entities" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "roles" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndUser" (
    "id" TEXT NOT NULL,
    "correlationId" VARCHAR,
    "verificationId" VARCHAR,
    "endUserType" TEXT,
    "approvalState" "ApprovalState" NOT NULL DEFAULT 'NEW',
    "stateReason" VARCHAR,
    "jsonData" JSONB,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "email" TEXT,
    "phone" VARCHAR,
    "dateOfBirth" TIMESTAMP(3),
    "avatarUrl" TEXT,
    "additionalInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EndUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndUsersOnBusinesses" (
    "endUserId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "EndUsersOnBusinesses_pkey" PRIMARY KEY ("endUserId","businessId")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "correlationId" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyName" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "legalForm" TEXT,
    "countryOfIncorporation" TEXT,
    "dateOfIncorporation" TIMESTAMP(3),
    "address" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "taxIdentificationNumber" TEXT,
    "vatNumber" TEXT,
    "shareholderStructure" JSONB,
    "numberOfEmployees" INTEGER,
    "businessPurpose" TEXT,
    "documents" JSONB,
    "approvalState" "ApprovalState" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowDefinition" (
    "id" TEXT NOT NULL,
    "reviewMachineId" TEXT,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "definitionType" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "contextSchema" JSONB,
    "config" JSONB,
    "supportedPlatforms" JSONB,
    "extensions" JSONB,
    "backend" JSONB,
    "persistStates" JSONB,
    "submitStates" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "WorkflowDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowRuntimeData" (
    "id" TEXT NOT NULL,
    "endUserId" TEXT,
    "businessId" TEXT,
    "assigneeId" TEXT,
    "workflowDefinitionId" TEXT NOT NULL,
    "workflowDefinitionVersion" INTEGER NOT NULL,
    "context" JSONB NOT NULL,
    "state" TEXT,
    "status" "WorkflowRuntimeDataStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "WorkflowRuntimeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileNameOnDisk" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "fileNameInBucket" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "tasks" JSONB NOT NULL,
    "rulesSets" JSONB NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "query" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BusinessToEndUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Entities_email_key" ON "Entities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entities_phone_key" ON "Entities"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "EndUser_correlationId_key" ON "EndUser"("correlationId");

-- CreateIndex
CREATE INDEX "EndUser_endUserType_idx" ON "EndUser"("endUserType");

-- CreateIndex
CREATE INDEX "EndUser_approvalState_idx" ON "EndUser"("approvalState");

-- CreateIndex
CREATE INDEX "EndUser_createdAt_idx" ON "EndUser"("createdAt");

-- CreateIndex
CREATE INDEX "EndUsersOnBusinesses_businessId_idx" ON "EndUsersOnBusinesses"("businessId");

-- CreateIndex
CREATE INDEX "EndUsersOnBusinesses_endUserId_idx" ON "EndUsersOnBusinesses"("endUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_correlationId_key" ON "Business"("correlationId");

-- CreateIndex
CREATE INDEX "Business_companyName_idx" ON "Business"("companyName");

-- CreateIndex
CREATE INDEX "Business_approvalState_idx" ON "Business"("approvalState");

-- CreateIndex
CREATE INDEX "Business_correlationId_idx" ON "Business"("correlationId");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_assigneeId_status_idx" ON "WorkflowRuntimeData"("assigneeId", "status");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_endUserId_status_idx" ON "WorkflowRuntimeData"("endUserId", "status");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_businessId_status_idx" ON "WorkflowRuntimeData"("businessId", "status");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_workflowDefinitionId_status_idx" ON "WorkflowRuntimeData"("workflowDefinitionId", "status");

-- CreateIndex
CREATE INDEX "WorkflowRuntimeData_state_idx" ON "WorkflowRuntimeData"("state");

-- CreateIndex
CREATE INDEX "File_userId_idx" ON "File"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Filter_name_key" ON "Filter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BusinessToEndUser_AB_unique" ON "_BusinessToEndUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BusinessToEndUser_B_index" ON "_BusinessToEndUser"("B");

-- AddForeignKey
ALTER TABLE "EndUsersOnBusinesses" ADD CONSTRAINT "EndUsersOnBusinesses_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndUsersOnBusinesses" ADD CONSTRAINT "EndUsersOnBusinesses_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToEndUser" ADD CONSTRAINT "_BusinessToEndUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToEndUser" ADD CONSTRAINT "_BusinessToEndUser_B_fkey" FOREIGN KEY ("B") REFERENCES "EndUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
