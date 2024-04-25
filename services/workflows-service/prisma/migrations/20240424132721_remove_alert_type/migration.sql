/*
  Warnings:

  - You are about to drop the column `type` on the `AlertDefinition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlertDefinition" DROP COLUMN "type";

-- DropEnum
DROP TYPE "AlertType";
