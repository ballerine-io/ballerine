import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RiskRuleSetRepository } from '@/risk-rules/risk-rule-set/risk-rule-set.repository';
import { RiskRuleSetService } from '@/risk-rules/risk-rule-set/risk-rule-set.service';
import { ProjectModule } from '@/project/project.module';

@Module({
  imports: [AppLoggerModule, PrismaModule, ProjectModule],
  providers: [RiskRuleSetService, RiskRuleSetRepository],
  exports: [RiskRuleSetService],
})
export class RiskRuleSetModule {}
