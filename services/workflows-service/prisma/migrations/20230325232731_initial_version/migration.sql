-- CreateEnum
CREATE TYPE "EndUserState" AS ENUM ('APPROVED', 'REJECTED', 'PROCESSING', 'NEW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndUser" (
    "id" TEXT NOT NULL,
    "correlationId" VARCHAR NOT NULL,
    "verificationId" VARCHAR,
    "endUserType" TEXT,
    "state" "EndUserState" NOT NULL DEFAULT 'NEW',
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
CREATE TABLE "WorkflowDefinition" (
    "id" TEXT NOT NULL,
    "reviewMachineId" TEXT,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "definitionType" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
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
    "endUserId" TEXT NOT NULL,
    "workflowDefinitionId" TEXT NOT NULL,
    "workflowDefinitionVersion" INTEGER NOT NULL,
    "context" JSONB NOT NULL,
    "state" TEXT,
    "status" TEXT NOT NULL DEFAULT 'created',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "WorkflowRuntimeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileNameOnDisk" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRuntimeData" ADD CONSTRAINT "WorkflowRuntimeData_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
