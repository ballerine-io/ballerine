import { Module } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
import { NotionModule } from '@/notion/notion.module';
import { RiskRuleService } from '@/rule-engine/risk-rule.service';
import { RiskRulePolicyModule } from '@/risk-rules/risk-rule-policy/risk-rule-policy.module';

@Module({
  imports: [NotionModule, RiskRulePolicyModule],
  providers: [RuleEngineService, RiskRuleService],
  exports: [RuleEngineService, RiskRuleService],
})
export class RuleEngineModule {}
