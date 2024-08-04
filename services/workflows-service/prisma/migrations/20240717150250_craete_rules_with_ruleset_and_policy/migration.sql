-- CreateEnum
CREATE TYPE "IndicatorRiskLevel" AS ENUM ('positive', 'moderate', 'critical');

-- CreateEnum
CREATE TYPE "RuleEngine" AS ENUM ('Ballerine', 'JsonLogic');

-- CreateEnum
CREATE TYPE "RulesetOperator" AS ENUM ('and', 'or');

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
CREATE TABLE "RiskRuleSetRule" (
    "id" TEXT NOT NULL,
    "riskRuleSetId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRuleSetRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRulesPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRulesPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRuleSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "riskRulePolicyId" TEXT NOT NULL,
    "operator" "RulesetOperator" NOT NULL,
    "projectId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "domain" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "riskLevel" "IndicatorRiskLevel" NOT NULL,
    "baseRiskScore" INTEGER NOT NULL,
    "additionalRiskScore" INTEGER NOT NULL,
    "minRiskScore" INTEGER,
    "maxRiskScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ruleId" TEXT,

    CONSTRAINT "RiskRuleSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "key" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "comparisonValue" JSONB NOT NULL,
    "engine" "RuleEngine" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_riskRuleSetRules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
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
CREATE INDEX "RiskRuleSetRule_riskRuleSetId_idx" ON "RiskRuleSetRule"("riskRuleSetId");

-- CreateIndex
CREATE INDEX "RiskRuleSetRule_ruleId_idx" ON "RiskRuleSetRule"("ruleId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskRuleSetRule_riskRuleSetId_ruleId_key" ON "RiskRuleSetRule"("riskRuleSetId", "ruleId");

-- CreateIndex
CREATE INDEX "RiskRulesPolicy_projectId_idx" ON "RiskRulesPolicy"("projectId");

-- CreateIndex
CREATE INDEX "RiskRuleSet_riskRulePolicyId_idx" ON "RiskRuleSet"("riskRulePolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskRuleSet_id_riskRulePolicyId_key" ON "RiskRuleSet"("id", "riskRulePolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "_riskRuleSetRules_AB_unique" ON "_riskRuleSetRules"("A", "B");

-- CreateIndex
CREATE INDEX "_riskRuleSetRules_B_index" ON "_riskRuleSetRules"("B");

-- AddForeignKey
ALTER TABLE "WorkflowDefinitionRiskRulePolicy" ADD CONSTRAINT "WorkflowDefinitionRiskRulePolicy_riskRulesPolicyId_fkey" FOREIGN KEY ("riskRulesPolicyId") REFERENCES "RiskRulesPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowDefinitionRiskRulePolicy" ADD CONSTRAINT "WorkflowDefinitionRiskRulePolicy_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRuleSetRule" ADD CONSTRAINT "RiskRuleSetRule_riskRuleSetId_fkey" FOREIGN KEY ("riskRuleSetId") REFERENCES "RiskRuleSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRuleSetRule" ADD CONSTRAINT "RiskRuleSetRule_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRulesPolicy" ADD CONSTRAINT "RiskRulesPolicy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRuleSet" ADD CONSTRAINT "RiskRuleSet_riskRulePolicyId_fkey" FOREIGN KEY ("riskRulePolicyId") REFERENCES "RiskRulesPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_riskRuleSetRules" ADD CONSTRAINT "_riskRuleSetRules_A_fkey" FOREIGN KEY ("A") REFERENCES "RiskRuleSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_riskRuleSetRules" ADD CONSTRAINT "_riskRuleSetRules_B_fkey" FOREIGN KEY ("B") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Checkers
ALTER TABLE "Rule"
ADD CONSTRAINT "is_rule_public_or_project_id_check"
CHECK (("isPublic" = true AND "projectId" IS NULL) OR ("isPublic" = false AND "projectId" IS NOT NULL));

ALTER TABLE "RiskRuleSet"
ADD CONSTRAINT "is_risk_rule_set_public_or_project_id_check"
CHECK (("isPublic" = true AND "projectId" IS NULL) OR ("isPublic" = false AND "projectId" IS NOT NULL));

ALTER TABLE "RiskRulesPolicy"
ADD CONSTRAINT "is_risk_rule_policy_public_or_project_id_check"
CHECK (("isPublic" = true AND "projectId" IS NULL) OR ("isPublic" = false AND "projectId" IS NOT NULL));
