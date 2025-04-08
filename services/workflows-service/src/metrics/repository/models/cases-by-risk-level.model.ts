import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CasesByRiskLevelMetricModel {
  @ApiProperty()
  @IsNumber()
  count!: number;

  @ApiProperty()
  @IsString()
  riskLevel!: string;
}
