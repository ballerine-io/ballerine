/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Filter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Filter_name_key" ON "Filter"("name");
