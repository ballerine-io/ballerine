import { CustomerModule } from '@/customer/customer.module';
import { FilterModule } from '@/filter/filter.module';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectScopeService } from '@/project/project-scope.service';
import { WorkflowDefinitionController } from '@/workflow-defintion/workflow-definition.controller';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, FilterModule, CustomerModule],
  controllers: [WorkflowDefinitionController],
  providers: [
    WorkflowDefinitionRepository,
    FilterService,
    WorkflowDefinitionService,
    ProjectScopeService,
    FilterRepository,
  ],
  exports: [WorkflowDefinitionRepository, WorkflowDefinitionService],
})
export class WorkflowDefinitionModule {}
