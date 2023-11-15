-- CreateTable
CREATE TABLE "DataMigrationVersion" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "migratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DataMigrationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataMigrationVersion_version_key" ON "DataMigrationVersion"("version");
