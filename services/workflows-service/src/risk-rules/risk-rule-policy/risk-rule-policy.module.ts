import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { RiskRulePolicyService } from '@/risk-rules/risk-rule-policy/risk-rule-policy.service';
import { RiskRulePolicyRepository } from '@/risk-rules/risk-rule-policy/risk-rule-policy.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { RiskRulePolicyController } from '@/risk-rules/risk-rule-policy/risk-rule-policy.controller';

@Module({
  controllers: [RiskRulePolicyController],
  imports: [AppLoggerModule, PrismaModule, ProjectModule],
  providers: [RiskRulePolicyService, RiskRulePolicyRepository],
  exports: [RiskRulePolicyService],
})
export class RiskRulePolicyModule {}
