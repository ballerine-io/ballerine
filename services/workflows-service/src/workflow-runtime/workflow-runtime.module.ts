import { WorkflowRuntimeDataRepository } from '@/workflow-runtime/workflow-runtime-data.repository';
import { WorkflowRuntimeController } from '@/workflow-runtime/workflow-runtime.controller';
import { WorkflowRuntimeService } from '@/workflow-runtime/workflow-runtime.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [WorkflowRuntimeController],
  providers: [WorkflowRuntimeDataRepository, WorkflowRuntimeService],
})
export class WorkflowRuntimeModule {}
