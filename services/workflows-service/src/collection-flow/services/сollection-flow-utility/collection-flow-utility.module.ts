// eslint-disable-next-line import/no-cycle
import { WorkflowModule } from '@/workflow/workflow.module';
import { forwardRef, Module } from '@nestjs/common';
import { CollectionFlowUtilityService } from './collection-flow-utility.service';
import { UiDefinitionModule } from '@/ui-definition/ui-definition.module';

@Module({
  imports: [
    // eslint-disable-next-line import/no-cycle
    forwardRef(() => WorkflowModule),
    UiDefinitionModule,
  ],
  providers: [CollectionFlowUtilityService],
  exports: [CollectionFlowUtilityService],
})
export class CollectionFlowUtilityModule {}
