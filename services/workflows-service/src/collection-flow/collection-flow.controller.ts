import * as common from '@nestjs/common';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { AuthorizeDto } from '@/collection-flow/dto/authorize-input.dto';
import { UseKeyAuthGuard } from '@/common/decorators/use-key-auth-guard.decorator';
import { EndUser } from '@prisma/client';
import { GetActiveFlowDto } from '@/collection-flow/dto/get-active-workflow-input.dto';

@common.Controller('collection-flow')
export class ColectionFlowController {
  constructor(protected readonly service: CollectionFlowService) {}

  @common.Post('/authorize')
  @UseKeyAuthGuard()
  async authorizeUser(@common.Body() dto: AuthorizeDto): Promise<EndUser> {
    return this.service.authorize({ email: dto.email });
  }

  @common.Get('/active-flow')
  @UseKeyAuthGuard()
  async getActiveFlow(@common.Query() query: GetActiveFlowDto) {
    const activeWorkflow = await this.service.getActiveFlow({
      endUserId: query.endUserId,
      workflowRuntimeDefinitionId: query.workflowRuntimeDefinitionId,
    });

    return {
      result: activeWorkflow,
    };
  }
}
