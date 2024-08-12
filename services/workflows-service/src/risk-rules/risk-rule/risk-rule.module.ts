import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { RiskRuleService } from '@/risk-rules/risk-rule/risk-rule.service';
import { RiskRuleRepository } from '@/risk-rules/risk-rule/risk-rule.repository';

@Module({
  imports: [AppLoggerModule, PrismaModule, ProjectModule],
  providers: [RiskRuleService, RiskRuleService],
  exports: [RiskRuleRepository, RiskRuleRepository],
})
export class RiskRuleModule {}
