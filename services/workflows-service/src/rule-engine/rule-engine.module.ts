import { Module } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
import { NotionModule } from '@/notion/notion.module';
import { RiskRuleService } from '@/rule-engine/risk-rule.service';

@Module({
  imports: [NotionModule],
  providers: [RuleEngineService, RiskRuleService],
  exports: [RuleEngineService, RiskRuleService],
})
export class RuleEngineModule {}
