import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds } from '@/types';
import { StatisticsService } from '@/statistics/statistics.service';
import { StatisticsOutputDto } from '@/statistics/statistics-output.dto';
import { StatisticsInputDto } from '@/statistics/statistics-input.dto';

@swagger.ApiExcludeController()
@common.Controller('internal/statistics')
export class StatisticsControllerInternal {
  constructor(protected readonly service: StatisticsService) {}

  @common.Post('')
  @swagger.ApiOkResponse({ type: StatisticsOutputDto })
  async getById(
    @ProjectIds() projectIds: TProjectIds,
    @common.Body() body: StatisticsInputDto,
  ): Promise<StatisticsOutputDto> {
    return await this.service.getStatistics(body, projectIds);
  }
}
