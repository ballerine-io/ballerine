import { CaseManagementService } from '@/case-management/case-management.service';
import { CaseManagementController } from '@/case-management/controllers/case-management.controller';
import { TransactionModule } from '@/transaction/transaction.module';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';
import { WorkflowModule } from '@/workflow/workflow.module';
import { Module } from '@nestjs/common';
import { AlertModule } from '@/alert/alert.module';
import { EndUserModule } from '@/end-user/end-user.module';

@Module({
  imports: [
    WorkflowDefinitionModule,
    WorkflowModule,
    TransactionModule,
    EndUserModule,
    AlertModule,
  ],
  providers: [CaseManagementService],
  controllers: [CaseManagementController],
})
export class CaseManagementModule {}
