import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { GetActiveFlowDto } from '@/collection-flow/dto/get-active-flow.dto';
import * as common from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';

@common.Controller('collection-flow')
export class CollectionFlowController {
  constructor(private readonly collectionFlowService: CollectionFlowService) {}

  @common.Get('/active-flow')
  @UseGuards(CustomerAuthGuard)
  async getActiveFlow(@common.Query() query: GetActiveFlowDto) {
    const activeWorkflow = await this.collectionFlowService.getLastActiveFlow({
      email: query.email,
      workflowRuntimeDefinitionId: query.workflowRuntimeDefinitionId,
    });

    return {
      result: activeWorkflow,
    };
  }
}
