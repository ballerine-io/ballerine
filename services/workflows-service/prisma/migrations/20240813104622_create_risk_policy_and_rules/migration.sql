-- CreateEnum
CREATE TYPE "IndicatorRiskLevel" AS ENUM ('positive', 'moderate', 'critical');

-- CreateEnum
CREATE TYPE "RuleEngine" AS ENUM ('Ballerine', 'JsonLogic');

-- CreateEnum
CREATE TYPE "RulesetOperator" AS ENUM ('and', 'or');

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
CREATE TABLE "RiskRule" (
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

    CONSTRAINT "RiskRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRuleRuleSet" (
    "id" TEXT NOT NULL,
    "riskRuleId" TEXT NOT NULL,
    "ruleSetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRuleRuleSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuleSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "operator" "RulesetOperator" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuleSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuleSetToRuleSet" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuleSetToRuleSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuleSetRule" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "ruleSetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuleSetRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "key" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "comparisonValue" JSONB NOT NULL,
    "engine" "RuleEngine" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RiskRuleSetToRuleSet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "RiskRulesPolicy_projectId_idx" ON "RiskRulesPolicy"("projectId");

-- CreateIndex
CREATE INDEX "RiskRule_riskRulePolicyId_idx" ON "RiskRule"("riskRulePolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskRule_id_riskRulePolicyId_key" ON "RiskRule"("id", "riskRulePolicyId");

-- CreateIndex
CREATE INDEX "RiskRuleRuleSet_riskRuleId_idx" ON "RiskRuleRuleSet"("riskRuleId");

-- CreateIndex
CREATE INDEX "RiskRuleRuleSet_ruleSetId_idx" ON "RiskRuleRuleSet"("ruleSetId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskRuleRuleSet_riskRuleId_ruleSetId_key" ON "RiskRuleRuleSet"("riskRuleId", "ruleSetId");

-- CreateIndex
CREATE INDEX "RuleSetToRuleSet_parentId_idx" ON "RuleSetToRuleSet"("parentId");

-- CreateIndex
CREATE INDEX "RuleSetToRuleSet_childId_idx" ON "RuleSetToRuleSet"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "RuleSetToRuleSet_parentId_childId_key" ON "RuleSetToRuleSet"("parentId", "childId");

-- CreateIndex
CREATE INDEX "RuleSetRule_ruleId_idx" ON "RuleSetRule"("ruleId");

-- CreateIndex
CREATE INDEX "RuleSetRule_ruleSetId_idx" ON "RuleSetRule"("ruleSetId");

-- CreateIndex
CREATE UNIQUE INDEX "RuleSetRule_ruleId_ruleSetId_key" ON "RuleSetRule"("ruleId", "ruleSetId");

-- CreateIndex
CREATE UNIQUE INDEX "_RiskRuleSetToRuleSet_AB_unique" ON "_RiskRuleSetToRuleSet"("A", "B");

-- CreateIndex
CREATE INDEX "_RiskRuleSetToRuleSet_B_index" ON "_RiskRuleSetToRuleSet"("B");

-- AddForeignKey
ALTER TABLE "RiskRulesPolicy" ADD CONSTRAINT "RiskRulesPolicy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRule" ADD CONSTRAINT "RiskRule_riskRulePolicyId_fkey" FOREIGN KEY ("riskRulePolicyId") REFERENCES "RiskRulesPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRuleRuleSet" ADD CONSTRAINT "RiskRuleRuleSet_riskRuleId_fkey" FOREIGN KEY ("riskRuleId") REFERENCES "RiskRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRuleRuleSet" ADD CONSTRAINT "RiskRuleRuleSet_ruleSetId_fkey" FOREIGN KEY ("ruleSetId") REFERENCES "RuleSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleSetToRuleSet" ADD CONSTRAINT "RuleSetToRuleSet_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "RuleSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleSetToRuleSet" ADD CONSTRAINT "RuleSetToRuleSet_childId_fkey" FOREIGN KEY ("childId") REFERENCES "RuleSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleSetRule" ADD CONSTRAINT "RuleSetRule_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleSetRule" ADD CONSTRAINT "RuleSetRule_ruleSetId_fkey" FOREIGN KEY ("ruleSetId") REFERENCES "RuleSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RiskRuleSetToRuleSet" ADD CONSTRAINT "_RiskRuleSetToRuleSet_A_fkey" FOREIGN KEY ("A") REFERENCES "RiskRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RiskRuleSetToRuleSet" ADD CONSTRAINT "_RiskRuleSetToRuleSet_B_fkey" FOREIGN KEY ("B") REFERENCES "RuleSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
