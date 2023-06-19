/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as nestAccessControl from 'nest-access-control';
import { UseKeyAuthInDevGuard } from '@/common/decorators/use-key-auth-in-dev-guard.decorator';

import { plainToClass } from 'class-transformer';
import { WorkflowRuntimeService } from '@/workflow-runtime/workflow-runtime.service';
import { GetWorkflowsRuntimeResponseDto } from '@/workflow-runtime/dto/output/get-workflows-runtime-response.dto';
import { GetWorkflowsRuntimeDto } from '@/workflow-runtime/dto/input/get-workflows-runtime.dto';

@swagger.ApiBearerAuth()
@swagger.ApiTags('workflow-runtime')
@common.Controller('workflow-runtime')
export class WorkflowRuntimeController {
  constructor(
    protected readonly service: WorkflowRuntimeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Get('/')
  @swagger.ApiBadRequestResponse({ type: common.BadRequestException })
  @swagger.ApiOkResponse({ type: GetWorkflowsRuntimeResponseDto })
  @common.HttpCode(200)
  @UseKeyAuthInDevGuard()
  async getWorkflowsRuntime(@common.Query() query: GetWorkflowsRuntimeDto) {
    const plainResults = await this.service.listWorkflowsRuntime({
      page: query.page,
      size: query.limit,
      status: query.status,
    });

    return plainToClass(GetWorkflowsRuntimeResponseDto, plainResults);
  }
}
