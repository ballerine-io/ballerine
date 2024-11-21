-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('Business', 'EndUser');

-- CreateEnum
CREATE TYPE "Noteable" AS ENUM ('Report', 'Alert', 'Workflow');

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "noteableId" TEXT NOT NULL,
    "noteableType" "Noteable" NOT NULL,
    "content" TEXT NOT NULL,
    "parentNoteId" TEXT,
    "fileIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'SYSTEM',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_entityId_entityType_projectId_idx" ON "Note"("entityId", "entityType", "projectId");

-- CreateIndex
CREATE INDEX "Note_noteableId_noteableType_projectId_idx" ON "Note"("noteableId", "noteableType", "projectId");

-- CreateIndex
CREATE INDEX "Note_projectId_idx" ON "Note"("projectId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_parentNoteId_fkey" FOREIGN KEY ("parentNoteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
