-- CreateTable
CREATE TABLE "SalesforceIntegration" (
    "id" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" VARCHAR(500) NOT NULL,
    "accessToken" VARCHAR(500) NOT NULL,
    "accessTokenIssuedAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" VARCHAR(500) NOT NULL,
    "instanceUrl" VARCHAR(500) NOT NULL,
    "userId" VARCHAR(500) NOT NULL,
    "organizationId" VARCHAR(500) NOT NULL,
    "idUrl" VARCHAR(500) NOT NULL,

    CONSTRAINT "SalesforceIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesforceIntegration_projectId_key" ON "SalesforceIntegration"("projectId");

-- AddForeignKey
ALTER TABLE "SalesforceIntegration" ADD CONSTRAINT "SalesforceIntegration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
