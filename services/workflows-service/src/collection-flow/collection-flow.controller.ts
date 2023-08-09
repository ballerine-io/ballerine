import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { GetActiveFlowDto } from '@/collection-flow/dto/get-active-flow.dto';
import { UseKeyAuthGuard } from '@/common/decorators/use-key-auth-guard.decorator';
import * as common from '@nestjs/common';

@common.Controller('collection-flow')
export class CollectionFlowController {
  constructor(private readonly collectionFlowService: CollectionFlowService) {}

  @common.Get('/active-flow')
  @UseKeyAuthGuard()
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
