import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { RiskRuleSetService } from '@/risk-rule-set/risk-rule-set.service';
import { RiskRuleSetRepository } from '@/risk-rule-set/risk-rule-set.repository';

@Module({
  imports: [AppLoggerModule],
  providers: [RiskRuleSetService, RiskRuleSetRepository],
  exports: [RiskRuleSetService],
})
export class RiskRuleSetModule {}
