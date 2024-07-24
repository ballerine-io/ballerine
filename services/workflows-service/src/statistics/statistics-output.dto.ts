import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class RiskIndicatorsStatisticsDto {
  @Type(() => String)
  name!: string;

  @Type(() => Number)
  count!: number;
}

export class ReportsByRiskLevel {
  @Type(() => Number)
  low!: number;

  @Type(() => Number)
  medium!: number;

  @Type(() => Number)
  high!: number;

  @Type(() => Number)
  critical!: number;
}

export class ReportsStatisticsDto {
  @Type(() => ReportsByRiskLevel)
  all!: ReportsByRiskLevel;

  @Type(() => ReportsByRiskLevel)
  inProgress!: ReportsByRiskLevel;

  @Type(() => ReportsByRiskLevel)
  approved!: ReportsByRiskLevel;
}

export class StatisticsOutputDto {
  @ValidateNested({ each: true })
  @Type(() => RiskIndicatorsStatisticsDto)
  riskIndicators!: RiskIndicatorsStatisticsDto[];

  @ValidateNested()
  @Type(() => ReportsStatisticsDto)
  reports!: ReportsStatisticsDto;
}
