import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StatisticsOutputDto } from '@/statistics/statistics-output.dto';
import { StatisticsInputDto } from '@/statistics/statistics-input.dto';
import type { TProjectId, TProjectIds } from '@/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStatistics(
    input: StatisticsInputDto,
    projectIds: TProjectIds,
  ): Promise<StatisticsOutputDto> {
    return {
      violations: await this.getViolations(
        { direction: input.violationsDirection },
        projectIds![0]!,
      ),
    };
  }

  async getViolations(
    { limit = 5, direction }: { limit?: number; direction: 'asc' | 'desc' },
    projectId: TProjectId,
  ) {
    return (
      await this.prismaService.$queryRaw<Array<{ name: string; count: string }>>`
        WITH flattened_indicators AS (SELECT jsonb_array_elements(report -> 'data' -> 'summary' ->
          'riskIndicatorsByDomain' ->
          (jsonb_object_keys(report -> 'data' -> 'summary' -> 'riskIndicatorsByDomain'))) AS indicator,
          "projectId"
        FROM
          "BusinessReport"
          )
        SELECT
          indicator ->> 'name' AS name, COUNT(*) AS count
        FROM
          flattened_indicators
        WHERE
          indicator ->> 'name' IS NOT NULL
          AND "projectId" = ${projectId}
        GROUP BY
          indicator ->> 'name'
        ORDER BY
          count ${Prisma.raw(direction)},
          indicator ->> 'name' ASC
        LIMIT ${limit};`
    ).map(({ name, count }) => ({
      name,
      count: Number(count),
    }));
  }
}
