import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { RiskRulePolicyService } from '@/risk-rules/risk-rule-policy/risk-rule-policy.service';
import { RiskRulePolicyRepository } from '@/risk-rules/risk-rule-policy/risk-rule-policy.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { RiskRuleSetModule } from '@/risk-rules/risk-rule-set/risk-rule-set.module';
import { ProjectModule } from '@/project/project.module';

@Module({
  imports: [AppLoggerModule, PrismaModule, RiskRuleSetModule, ProjectModule],
  providers: [RiskRulePolicyService, RiskRulePolicyRepository],
  exports: [RiskRulePolicyService],
})
export class RiskRulePolicyModule {}
