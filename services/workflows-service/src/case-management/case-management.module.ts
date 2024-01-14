import { CaseManagementService } from '@/case-management/case-management.service';
import { CaseManagementController } from '@/case-management/controllers/case-management.controller';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';
import { WorkflowServiceModule } from '@/workflow/workflow-service.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [WorkflowDefinitionModule, WorkflowServiceModule],
  providers: [CaseManagementService],
  controllers: [CaseManagementController],
})
export class CaseManagementModule {}
