import { forwardRef, Module } from '@nestjs/common';
import { ProjectModule } from '@/project/project.module';
import { UiDefinitionController } from '@/ui-definition/ui-definition.controller.internal';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { WorkflowModule } from '@/workflow/workflow.module';

@Module({
  imports: [ProjectModule, forwardRef(() => WorkflowModule)],
  controllers: [UiDefinitionController],
  providers: [WorkflowRuntimeDataRepository, UiDefinitionRepository, UiDefinitionService],
  exports: [UiDefinitionRepository, UiDefinitionService],
})
export class UiDefinitionModule {}
