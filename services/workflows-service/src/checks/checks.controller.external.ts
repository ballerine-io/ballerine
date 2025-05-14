import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ChecksService } from './checks.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@common.Controller('external/checks')
@ApiBearerAuth()
@swagger.ApiTags('Checks')
export class ChecksControllerExternal {
  constructor(private readonly checksService: ChecksService) {}

  @common.Get('/latest-by-end-user-and-workflow-runtime-data-id/:endUserId/:workflowRuntimeDataId')
  @swagger.ApiOperation({ summary: 'Get latest check by end user and workflow runtime data id' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully returned latest check by end user and workflow runtime data id',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  async getLatestCheckByEndUserAndWorkflowRuntimeDataId(
    @common.Param('endUserId') endUserId: string,
    @common.Param('workflowRuntimeDataId') workflowRuntimeDataId: string,
    @common.Query('projectId') projectId: string,
  ) {
    const check = await this.checksService.getLatestCheckByEndUserAndWorkflowRuntimeDataId({
      endUserId,
      workflowRuntimeDataId,
      projectId,
    });

    return check;
  }
}
