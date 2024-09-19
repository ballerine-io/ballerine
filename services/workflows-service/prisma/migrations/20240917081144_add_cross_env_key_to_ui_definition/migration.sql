/*
  Warnings:

  - A unique constraint covering the columns `[crossEnvKey]` on the table `UiDefinition` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `crossEnvKey` to the `UiDefinition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UiDefinition" ADD COLUMN     "crossEnvKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UiDefinition_crossEnvKey_key" ON "UiDefinition"("crossEnvKey");
