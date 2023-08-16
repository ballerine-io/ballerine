import { ColectionFlowController } from '@/collection-flow/collection-flow.controller';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppLoggerModule],
  controllers: [ColectionFlowController],
  providers: [
    CollectionFlowService,
    EndUserService,
    EndUserRepository,
    WorkflowRuntimeDataRepository,
  ],
})
export class CollectionFlowModule {}
