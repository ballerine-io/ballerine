import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { RuleSetController } from '@/risk-rules/rule-set/rule-set.controller';
import { RuleSetService } from '@/risk-rules/rule-set/rule-set.service';
import { RuleSetRepository } from '@/risk-rules/rule-set/rule-set.repository';

@Module({
  controllers: [RuleSetController],
  imports: [AppLoggerModule, PrismaModule, ProjectModule],
  providers: [RuleSetService, RuleSetRepository],
  exports: [RuleSetService],
})
export class RuleSetModule {}
