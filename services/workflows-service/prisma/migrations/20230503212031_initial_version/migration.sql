/*
  Warnings:

  - You are about to drop the column `businessId` on the `EndUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EndUser" DROP CONSTRAINT "EndUser_businessId_fkey";

-- AlterTable
ALTER TABLE "EndUser" DROP COLUMN "businessId";

-- CreateTable
CREATE TABLE "EndUsersOnBusinesses" (
    "endUserId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "EndUsersOnBusinesses_pkey" PRIMARY KEY ("endUserId","businessId")
);

-- CreateTable
CREATE TABLE "_BusinessToEndUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BusinessToEndUser_AB_unique" ON "_BusinessToEndUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BusinessToEndUser_B_index" ON "_BusinessToEndUser"("B");

-- AddForeignKey
ALTER TABLE "EndUsersOnBusinesses" ADD CONSTRAINT "EndUsersOnBusinesses_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndUsersOnBusinesses" ADD CONSTRAINT "EndUsersOnBusinesses_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToEndUser" ADD CONSTRAINT "_BusinessToEndUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToEndUser" ADD CONSTRAINT "_BusinessToEndUser_B_fkey" FOREIGN KEY ("B") REFERENCES "EndUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
