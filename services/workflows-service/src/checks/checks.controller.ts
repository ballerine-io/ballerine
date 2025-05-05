import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { GetChecksDto } from './dto/get-checks.dto';
import { ChecksService } from './checks.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import type { TProjectId } from '@/types';
import { ApiBearerAuth } from '@nestjs/swagger';

@common.Controller('external/checks')
@ApiBearerAuth()
@swagger.ApiTags('Checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @common.Get()
  getChecks(@common.Query() query: GetChecksDto) {
    return this.checksService.getChecks(query);
  }

  @common.Get('/kyb-and-ownership')
  getKybAndOwnershipChecks(
    @common.Query() query: GetChecksDto,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.checksService.getKybAndOwnershipChecks(query, projectId);
  }
}
