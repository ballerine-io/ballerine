/*
  Warnings:

  - Added the required column `entityId` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `EndUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('EndUserType', 'UserType', 'BusinessType', 'WorkflowType');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EndUser" ADD COLUMN     "entityId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entity_entityId_entityType_idx" ON "Entity"("entityId", "entityType");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "enduser_entityId" FOREIGN KEY ("entityId") REFERENCES "EndUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "business_entityId" FOREIGN KEY ("entityId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
