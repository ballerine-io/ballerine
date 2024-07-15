-- CreateEnum
CREATE TYPE "IndicatorRiskLevel" AS ENUM ('positive', 'moderate', 'critical');

-- CreateTable
CREATE TABLE "WorkflowDefinitionRiskRuleSet" (
    "id" TEXT NOT NULL,
    "workflowDefinitionId" TEXT NOT NULL,
    "riskRulesPolicyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowDefinitionRiskRuleSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRulesPolicy" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "ruleSet" JSONB NOT NULL,
    "domain" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "riskLevel" "IndicatorRiskLevel" NOT NULL,
    "baseRiskSocre" INTEGER NOT NULL,
    "additionalRiskScore" INTEGER NOT NULL,
    "minRiskScore" INTEGER,
    "maxRiskScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRulesPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRuleSet" (
    "id" TEXT NOT NULL,
    "riskRulePolicyId" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "ruleSet" JSONB NOT NULL,
    "domain" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "riskLevel" "IndicatorRiskLevel" NOT NULL,
    "baseRiskSocre" INTEGER NOT NULL,
    "additionalRiskScore" INTEGER NOT NULL,
    "minRiskScore" INTEGER,
    "maxRiskScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinitionRiskRuleSet_workflowDefinitionId_key" ON "WorkflowDefinitionRiskRuleSet"("workflowDefinitionId");

-- CreateIndex
CREATE INDEX "WorkflowDefinitionRiskRuleSet_workflowDefinitionId_idx" ON "WorkflowDefinitionRiskRuleSet"("workflowDefinitionId");

-- CreateIndex
CREATE INDEX "WorkflowDefinitionRiskRuleSet_riskRulesPolicyId_idx" ON "WorkflowDefinitionRiskRuleSet"("riskRulesPolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinitionRiskRuleSet_workflowDefinitionId_riskRule_key" ON "WorkflowDefinitionRiskRuleSet"("workflowDefinitionId", "riskRulesPolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskRulesPolicy_uuid_key" ON "RiskRulesPolicy"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "RiskRuleSet_id_riskRulePolicyId_key" ON "RiskRuleSet"("id", "riskRulePolicyId");

-- AddForeignKey
ALTER TABLE "WorkflowDefinitionRiskRuleSet" ADD CONSTRAINT "WorkflowDefinitionRiskRuleSet_riskRulesPolicyId_fkey" FOREIGN KEY ("riskRulesPolicyId") REFERENCES "RiskRulesPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowDefinitionRiskRuleSet" ADD CONSTRAINT "WorkflowDefinitionRiskRuleSet_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRuleSet" ADD CONSTRAINT "RiskRuleSet_riskRulePolicyId_fkey" FOREIGN KEY ("riskRulePolicyId") REFERENCES "RiskRulesPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
