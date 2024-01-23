import { CaseManagementService } from '@/case-management/case-management.service';
import { CaseManagementController } from '@/case-management/controllers/case-management.controller';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';
import { WorkflowModule } from '@/workflow/workflow.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [WorkflowDefinitionModule, WorkflowModule],
  providers: [CaseManagementService],
  controllers: [CaseManagementController],
})
export class CaseManagementModule {}
