/*
  Warnings:

  - You are about to drop the column `type` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "type",
ADD COLUMN     "mimeType" TEXT;
