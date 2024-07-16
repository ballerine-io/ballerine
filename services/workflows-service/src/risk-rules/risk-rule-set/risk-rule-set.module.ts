import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RiskRuleSetService } from '@/risk-rules/risk-rule-set/risk-rule-set.service';
import { RiskRuleSetRepository } from '@/risk-rules/risk-rule-set/risk-rule-set.repository';

@Module({
  imports: [AppLoggerModule, PrismaModule],
  providers: [RiskRuleSetService, RiskRuleSetRepository],
  exports: [RiskRuleSetService],
})
export class RiskRuleSetModule {}
