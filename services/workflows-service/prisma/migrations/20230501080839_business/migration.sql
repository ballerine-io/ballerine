/*
  Warnings:

  - You are about to drop the column `status` on the `Business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "status",
ADD COLUMN     "approvalState" "ApprovalState" NOT NULL DEFAULT 'PROCESSING';
