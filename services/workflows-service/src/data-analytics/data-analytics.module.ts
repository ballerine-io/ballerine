import { forwardRef, Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { DataAnalyticsControllerInternal } from '@/data-analytics/data-analytics.controller.internal';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { DataAnalyticsControllerExternal } from '@/data-analytics/data-analytics.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectScopeService } from '@/project/project-scope.service';
// eslint-disable-next-line import/no-cycle
// eslint-disable-next-line import/no-cycle
import { AlertModule } from '@/alert/alert.module';
import { DataInvestigationService } from './data-investigation.service';

@Module({
  imports: [ACLModule, PrismaModule, forwardRef(() => AlertModule)],
  controllers: [DataAnalyticsControllerInternal, DataAnalyticsControllerExternal],
  providers: [DataAnalyticsService, ProjectScopeService, DataInvestigationService],
  exports: [DataAnalyticsService, DataInvestigationService],
})
export class DataAnalyticsModule {}
