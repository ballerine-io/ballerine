/*
  Warnings:

  - A unique constraint covering the columns `[name,projectId]` on the table `Filter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,customerId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Filter_name_key";

-- DropIndex
DROP INDEX "Project_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Filter_name_projectId_key" ON "Filter"("name", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_customerId_key" ON "Project"("name", "customerId");
