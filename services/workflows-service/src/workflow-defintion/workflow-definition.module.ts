import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { FilterModule } from '@/filter/filter.module';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { FilterService } from '@/filter/filter.service';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { FilterRepository } from '@/filter/filter.repository';
import { CustomerService } from '@/customer/customer.service';
import { CustomerRepository } from '@/customer/customer.repository';
import { CustomerModule } from '@/customer/customer.module';

@Module({
  imports: [PrismaModule, FilterModule, CustomerModule],
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
