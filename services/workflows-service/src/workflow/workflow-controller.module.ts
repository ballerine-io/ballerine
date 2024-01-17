import { Module } from '@nestjs/common';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowControllerInternal } from './workflow.controller.internal';
import { WorkflowModule } from '@/workflow/workflow.module';

@Module({
  imports: [WorkflowModule],
  controllers: [WorkflowControllerExternal, WorkflowControllerInternal],
  exports: [WorkflowModule],
})
export class WorkflowControllerModule {}
