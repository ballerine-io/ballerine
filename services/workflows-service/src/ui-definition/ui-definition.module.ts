import { ProjectModule } from '@/project/project.module';
import { UIDefinitionController } from '@/ui-definition/ui-definition.controller';
import { UIDefinitionExternalController } from '@/ui-definition/ui-definition.controller.external';
import { UiDefinitionControllerInternal } from '@/ui-definition/ui-definition.controller.internal';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowModule } from '@/workflow/workflow.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [ProjectModule, forwardRef(() => WorkflowModule)],
  controllers: [
    UiDefinitionControllerInternal,
    UIDefinitionExternalController,
    UIDefinitionController,
  ],
  providers: [WorkflowRuntimeDataRepository, UiDefinitionRepository, UiDefinitionService],
  exports: [UiDefinitionRepository, UiDefinitionService],
})
export class UiDefinitionModule {}
