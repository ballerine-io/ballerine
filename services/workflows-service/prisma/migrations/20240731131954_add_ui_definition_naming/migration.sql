-- AlterTable
ALTER TABLE "UiDefinition" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE INDEX "UiDefinition_name_projectId_idx" ON "UiDefinition"("name", "projectId");
