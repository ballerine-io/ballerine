-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "counterpartyBeneficiaryId" TEXT,
ADD COLUMN     "counterpartyOriginatorId" TEXT;

-- CreateIndex
CREATE INDEX "Alert_counterpartyOriginatorId_idx" ON "Alert"("counterpartyOriginatorId");

-- CreateIndex
CREATE INDEX "Alert_counterpartyBeneficiaryId_idx" ON "Alert"("counterpartyBeneficiaryId");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_counterpartyOriginatorId_fkey" FOREIGN KEY ("counterpartyOriginatorId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_counterpartyBeneficiaryId_fkey" FOREIGN KEY ("counterpartyBeneficiaryId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
