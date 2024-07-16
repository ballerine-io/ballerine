-- CreateEnum
CREATE TYPE "IndicatorRiskLevel" AS ENUM ('positive', 'moderate', 'critical');

-- CreateEnum
CREATE TYPE "RuleEngine" AS ENUM ('Ballerine', 'JsonLogic');

-- CreateTable
CREATE TABLE "WorkflowDefinitionRiskRulePolicy" (
    "id" TEXT NOT NULL,
    "workflowDefinitionId" TEXT NOT NULL,
    "riskRulesPolicyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowDefinitionRiskRulePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRulesPolicy" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRulesPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRuleSet" (
    "id" TEXT NOT NULL,
    "riskRulePolicyId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "riskLevel" "IndicatorRiskLevel" NOT NULL,
    "baseRiskScore" INTEGER NOT NULL,
    "additionalRiskScore" INTEGER NOT NULL,
    "minRiskScore" INTEGER,
    "maxRiskScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRuleSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "riskRuleSetId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "comparisonValue" JSONB NOT NULL,
    "engine" "RuleEngine" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "riskRuleSetRiskRulePolicyId" TEXT,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinitionRiskRulePolicy_workflowDefinitionId_key" ON "WorkflowDefinitionRiskRulePolicy"("workflowDefinitionId");

-- CreateIndex
CREATE INDEX "WorkflowDefinitionRiskRulePolicy_workflowDefinitionId_idx" ON "WorkflowDefinitionRiskRulePolicy"("workflowDefinitionId");

-- CreateIndex
CREATE INDEX "WorkflowDefinitionRiskRulePolicy_riskRulesPolicyId_idx" ON "WorkflowDefinitionRiskRulePolicy"("riskRulesPolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinitionRiskRulePolicy_workflowDefinitionId_riskR_key" ON "WorkflowDefinitionRiskRulePolicy"("workflowDefinitionId", "riskRulesPolicyId");

-- CreateIndex
CREATE INDEX "RiskRulesPolicy_projectId_idx" ON "RiskRulesPolicy"("projectId");

-- CreateIndex
CREATE INDEX "RiskRuleSet_riskRulePolicyId_idx" ON "RiskRuleSet"("riskRulePolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskRuleSet_id_riskRulePolicyId_key" ON "RiskRuleSet"("id", "riskRulePolicyId");

-- AddForeignKey
ALTER TABLE "WorkflowDefinitionRiskRulePolicy" ADD CONSTRAINT "WorkflowDefinitionRiskRulePolicy_riskRulesPolicyId_fkey" FOREIGN KEY ("riskRulesPolicyId") REFERENCES "RiskRulesPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowDefinitionRiskRulePolicy" ADD CONSTRAINT "WorkflowDefinitionRiskRulePolicy_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRulesPolicy" ADD CONSTRAINT "RiskRulesPolicy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRuleSet" ADD CONSTRAINT "RiskRuleSet_riskRulePolicyId_fkey" FOREIGN KEY ("riskRulePolicyId") REFERENCES "RiskRulesPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_riskRuleSetId_fkey" FOREIGN KEY ("riskRuleSetId") REFERENCES "RiskRuleSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
