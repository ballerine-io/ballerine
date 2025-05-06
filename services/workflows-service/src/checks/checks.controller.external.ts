import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { GetChecksDto } from './dto/get-checks.dto';
import { ChecksService } from './checks.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import type { TProjectId } from '@/types';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetKybAndOwnershipChecksDto } from './dto/get-kyb-and-ownership-checks.dto';
import { CreateCheckDto } from './dto/create-check.dto';

@common.Controller('external/checks')
@ApiBearerAuth()
@swagger.ApiTags('Checks')
export class ChecksControllerExternal {
  constructor(private readonly checksService: ChecksService) {}

  @common.Get()
  @swagger.ApiOperation({ summary: 'Get checks' })
  @swagger.ApiResponse({ status: 200, description: 'Successfully retrieved checks' })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  getChecks(@common.Query() query: GetChecksDto) {
    return this.checksService.getChecks(query);
  }

  @common.Get('/kyb_and_ownership')
  @swagger.ApiOperation({ summary: 'Get KYB and ownership checks' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Successfully retrieved KYB and ownership checks',
  })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  getKybAndOwnershipChecks(
    @common.Query() query: GetKybAndOwnershipChecksDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.checksService.getKybAndOwnershipChecks(query, projectId);
  }

  @common.Post('')
  @swagger.ApiOperation({ summary: 'Create KYB and ownership check' })
  @swagger.ApiResponse({ status: 201, description: 'Successfully created KYB and ownership check' })
  @swagger.ApiResponse({ status: 500, description: 'Internal server error' })
  createKybAndOwnershipCheck(
    @common.Body() body: CreateCheckDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.checksService.createCheck(body, projectId);
  }
}
