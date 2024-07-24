import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StatisticsOutputDto } from '@/statistics/statistics-output.dto';
import { StatisticsInputDto } from '@/statistics/statistics-input.dto';
import type { TProjectId, TProjectIds } from '@/types';
import { ApprovalState, BusinessReportStatus } from '@prisma/client';

const LOW_LTE_RISK_SCORE = 39;
const MEDIUM_LTE_RISK_SCORE = 69;
const HIGH_LTE_RISK_SCORE = 84;
const CRITICAL_GTE_RISK_SCORE = 85;

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStatistics(
    input: StatisticsInputDto,
    projectIds: TProjectIds,
  ): Promise<StatisticsOutputDto> {
    return {
      riskIndicators: await this.getRiskIndicators(projectIds![0]!),
      reports: {
        all: await this.getReportsByRiskLevel(projectIds![0]!),
        inProgress: await this.getInProgressReportsByRiskLevel(projectIds![0]!),
        approved: await this.getApprovedBusinessesReportsByRiskLevel(projectIds![0]!),
      },
    };
  }

  async getRiskIndicators(projectId: TProjectId) {
    return (
      await this.prismaService.$queryRaw<Array<{ name: string; count: string }>>`
        WITH "flattenedRiskIndicators" AS (SELECT jsonb_array_elements("report" -> 'data' -> 'summary' ->
          'riskIndicatorsByDomain' ->
          (jsonb_object_keys("report" -> 'data' -> 'summary' -> 'riskIndicatorsByDomain'))) AS "riskIndicator",
          "projectId"
        FROM
          "BusinessReport"
          )
        SELECT
          "riskIndicator" ->> 'name' AS name, COUNT(*) AS count
        FROM
          "flattenedRiskIndicators"
        WHERE
          "riskIndicator" ->> 'name' IS NOT NULL
          AND "projectId" = ${projectId}
        GROUP BY
          "riskIndicator" ->> 'name'
        ORDER BY
          "count" DESC,
          "riskIndicator" ->> 'name' ASC;`
    ).map(({ name, count }) => ({
      name,
      count: Number(count),
    }));
  }

  async getReportsByRiskLevel(projectId: TProjectId) {
    const results = await this.prismaService.$queryRaw<
      Array<{ riskLevel: 'low' | 'medium' | 'high' | 'critical'; count: number }>
    >`
        SELECT
          CASE
            WHEN "riskScore" <= ${LOW_LTE_RISK_SCORE} THEN 'low'
            WHEN "riskScore" <= ${MEDIUM_LTE_RISK_SCORE} THEN 'medium'
            WHEN "riskScore" <= ${HIGH_LTE_RISK_SCORE} THEN 'high'
            WHEN "riskScore" >= ${CRITICAL_GTE_RISK_SCORE} THEN 'critical'
          END AS "riskLevel",
          COUNT(*) AS "count"
        FROM
          "BusinessReport"
        WHERE
          "status"::text = ${BusinessReportStatus.completed}
          AND "BusinessReport"."projectId" = ${projectId}
        GROUP BY
          "riskLevel";`;

    return {
      low: Number(results.find(result => result.riskLevel === 'low')?.count ?? 0),
      medium: Number(results.find(result => result.riskLevel === 'medium')?.count ?? 0),
      high: Number(results.find(result => result.riskLevel === 'high')?.count ?? 0),
      critical: Number(results.find(result => result.riskLevel === 'critical')?.count ?? 0),
    };
  }

  async getInProgressReportsByRiskLevel(projectId: TProjectId) {
    const results = await this.prismaService.$queryRaw<
      Array<{ riskLevel: 'low' | 'medium' | 'high' | 'critical'; count: number }>
    >`
        SELECT
          CASE
            WHEN "riskScore" <= ${LOW_LTE_RISK_SCORE} THEN 'low'
            WHEN "riskScore" <= ${MEDIUM_LTE_RISK_SCORE} THEN 'medium'
            WHEN "riskScore" <= ${HIGH_LTE_RISK_SCORE} THEN 'high'
            WHEN "riskScore" >= ${CRITICAL_GTE_RISK_SCORE} THEN 'critical'
          END AS "riskLevel",
          COUNT(*) AS "count"
        FROM
          "BusinessReport"
        JOIN "Business" ON "BusinessReport"."businessId" = "Business"."id"
        WHERE
          "status"::text = ${BusinessReportStatus.in_progress}
          AND "BusinessReport"."projectId" = ${projectId}
          AND "Business"."approvalState"::text = ${ApprovalState.PROCESSING}
        GROUP BY
          "riskLevel";`;

    return {
      low: Number(results.find(result => result.riskLevel === 'low')?.count ?? 0),
      medium: Number(results.find(result => result.riskLevel === 'medium')?.count ?? 0),
      high: Number(results.find(result => result.riskLevel === 'high')?.count ?? 0),
      critical: Number(results.find(result => result.riskLevel === 'critical')?.count ?? 0),
    };
  }

  async getApprovedBusinessesReportsByRiskLevel(projectId: TProjectId) {
    const results = await this.prismaService.$queryRaw<
      Array<{ riskLevel: 'low' | 'medium' | 'high' | 'critical'; count: number }>
    >`
        SELECT
          CASE
            WHEN "riskScore" <= ${LOW_LTE_RISK_SCORE} THEN 'low'
            WHEN "riskScore" <= ${MEDIUM_LTE_RISK_SCORE} THEN 'medium'
            WHEN "riskScore" <= ${HIGH_LTE_RISK_SCORE} THEN 'high'
            WHEN "riskScore" >= ${CRITICAL_GTE_RISK_SCORE} THEN 'critical'
          END AS "riskLevel",
          COUNT(*) AS "count"
        FROM
          "BusinessReport"
        JOIN "Business" ON "BusinessReport"."businessId" = "Business"."id"
        WHERE
          "status"::text = ${BusinessReportStatus.completed}
          AND "BusinessReport"."projectId" = ${projectId}
          AND "Business"."approvalState"::text = ${ApprovalState.APPROVED}
        GROUP BY
          "riskLevel";`;

    return {
      low: Number(results.find(result => result.riskLevel === 'low')?.count ?? 0),
      medium: Number(results.find(result => result.riskLevel === 'medium')?.count ?? 0),
      high: Number(results.find(result => result.riskLevel === 'high')?.count ?? 0),
      critical: Number(results.find(result => result.riskLevel === 'critical')?.count ?? 0),
    };
  }
}
