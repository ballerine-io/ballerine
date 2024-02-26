/*
  Warnings:

  - The values [304,305] on the enum `AlertState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AlertState_new" AS ENUM ('101', '201', '202', '301', '302', '303');
ALTER TABLE "Alert" ALTER COLUMN "state" TYPE "AlertState_new" USING ("state"::text::"AlertState_new");
ALTER TYPE "AlertState" RENAME TO "AlertState_old";
ALTER TYPE "AlertState_new" RENAME TO "AlertState";
DROP TYPE "AlertState_old";
COMMIT;
