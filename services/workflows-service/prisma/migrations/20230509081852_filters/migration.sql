-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "query" JSONB NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);
