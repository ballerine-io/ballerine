import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { FilterModule } from '@/filter/filter.module';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { FilterService } from '@/filter/filter.service';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';

@Module({
  imports: [PrismaModule, FilterModule],
  providers: [WorkflowDefinitionRepository, FilterService, WorkflowDefinitionService],
  exports: [WorkflowDefinitionRepository, WorkflowDefinitionService],
})
export class WorkflowDefinitionModule {}
