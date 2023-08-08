import { CollectionFlowController } from '@/collection-flow/collection-flow.controller';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { CollectionFlowRepository } from '@/collection-flow/repository/collection-flow.repository';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import * as common from '@nestjs/common';

@common.Module({
  imports: [AppLoggerModule],
  controllers: [CollectionFlowController],
  providers: [
    WorkflowRuntimeDataRepository,
    CollectionFlowService,
    CollectionFlowRepository,
    EndUserService,
    EndUserRepository,
  ],
})
export class CollectionFlowModule {}
