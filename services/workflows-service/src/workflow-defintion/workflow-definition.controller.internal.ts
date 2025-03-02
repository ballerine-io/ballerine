import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiExcludeController } from '@nestjs/swagger';
import * as errors from '../errors';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { CreateDemoWorkflowDefinitionDto } from '@/workflow-defintion/dtos/create-demo-workflow-definition-dto';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';

@ApiExcludeController()
@common.Controller('internal/workflow-definition')
export class WorkflowControllerInternal {
  constructor(protected readonly service: WorkflowDefinitionService) {}

  @common.Post('/create-demo')
  @swagger.ApiOkResponse()
  @common.UseGuards(AdminAuthGuard)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async createDemoWorkflowDefinition(@common.Body() data: CreateDemoWorkflowDefinitionDto) {
    return await this.service.createDemoWorkflowDefinition({
      customerId: data.customerId,
      userId: data.userId,
      workflowOverrides: data.workflowOverrides,
    });
  }
}
