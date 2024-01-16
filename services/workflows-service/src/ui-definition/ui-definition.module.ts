import { Module } from '@nestjs/common';
import { ProjectModule } from '@/project/project.module';
import { WorkflowControllerModule } from '@/workflow/workflow-controller.module';
import { UiDefinitionController } from '@/ui-definition/ui-definition.controller.internal';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';

@Module({
  imports: [ProjectModule, WorkflowControllerModule],
  controllers: [UiDefinitionController],
  providers: [WorkflowRuntimeDataRepository, UiDefinitionRepository, UiDefinitionService],
  exports: [UiDefinitionRepository],
})
export class UiDefinitionModule {}
