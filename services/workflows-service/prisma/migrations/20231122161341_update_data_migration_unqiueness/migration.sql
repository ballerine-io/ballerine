/*
  Warnings:

  - A unique constraint covering the columns `[success,version]` on the table `DataMigrationVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DataMigrationVersion_version_key";

-- CreateIndex
CREATE UNIQUE INDEX "DataMigrationVersion_success_version_key"  ON "DataMigrationVersion" (version) WHERE success = TRUE;
