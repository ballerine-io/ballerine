import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RuleService } from '@/risk-rules/rule/rule.service';
import { RuleRepository } from '@/risk-rules/rule/rule.repository';
import { RuleController } from '@/risk-rules/rule/rule.controller';
import { ProjectModule } from '@/project/project.module';

@Module({
  controllers: [RuleController],
  imports: [AppLoggerModule, PrismaModule, ProjectModule],
  providers: [RuleService, RuleRepository],
  exports: [RuleService],
})
export class RuleModule {}
