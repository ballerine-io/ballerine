/*
  Warnings:

  - You are about to drop the column `documents` on the `Business` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('provided', 'requested');

-- CreateEnum
CREATE TYPE "DocumentDecision" AS ENUM ('approved', 'rejected', 'revisions');

-- CreateEnum
CREATE TYPE "DocumentFileType" AS ENUM ('selfie', 'document', 'other');

-- CreateEnum
CREATE TYPE "DocumentFileVariant" AS ENUM ('front', 'back', 'other');

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "documents";

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "issuingVersion" TEXT NOT NULL,
    "issuingCountry" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "decision" "DocumentDecision",
    "decisionReason" TEXT,
    "comment" TEXT,
    "properties" JSONB NOT NULL,
    "businessId" TEXT,
    "endUserId" TEXT,
    "workflowRuntimeDataId" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFile" (
    "id" TEXT NOT NULL,
    "type" "DocumentFileType" NOT NULL,
    "variant" "DocumentFileVariant" NOT NULL,
    "page" INTEGER NOT NULL,
    "documentId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_businessId_idx" ON "Document"("businessId");

-- CreateIndex
CREATE INDEX "Document_endUserId_idx" ON "Document"("endUserId");

-- CreateIndex
CREATE INDEX "Document_workflowRuntimeDataId_idx" ON "Document"("workflowRuntimeDataId");

-- CreateIndex
CREATE INDEX "DocumentFile_documentId_idx" ON "DocumentFile"("documentId");

-- CreateIndex
CREATE INDEX "DocumentFile_fileId_idx" ON "DocumentFile"("fileId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_workflowRuntimeDataId_fkey" FOREIGN KEY ("workflowRuntimeDataId") REFERENCES "WorkflowRuntimeData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
