import { Module } from '@nestjs/common';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowControllerInternal } from './workflow.controller.internal';
import { WorkflowServiceModule } from '@/workflow/workflow.module';

@Module({
  imports: [WorkflowServiceModule],
  controllers: [WorkflowControllerExternal, WorkflowControllerInternal],
  exports: [WorkflowServiceModule],
})
export class WorkflowControllerModule {}
