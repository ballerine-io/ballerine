import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CasesByRiskLevelMetric {
  @Transform(({ value }) => (value === null ? 0 : value))
  count!: number;

  @ApiProperty()
  riskLevel!: string;
}
