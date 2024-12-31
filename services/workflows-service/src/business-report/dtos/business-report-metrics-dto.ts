import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class RiskLevelCountsDto {
  @ApiProperty({
    description: 'Number of low risk reports',
    example: 5,
    type: Number,
  })
  @IsNumber()
  low!: number;

  @ApiProperty({
    description: 'Number of medium risk reports',
    example: 3,
    type: Number,
  })
  @IsNumber()
  medium!: number;

  @ApiProperty({
    description: 'Number of high risk reports',
    example: 2,
    type: Number,
  })
  @IsNumber()
  high!: number;

  @ApiProperty({
    description: 'Number of critical risk reports',
    example: 1,
    type: Number,
  })
  @IsNumber()
  critical!: number;
}

export class BusinessReportMetricsDto {
  @ApiProperty({
    description: 'Counts of reports by risk level',
    type: RiskLevelCountsDto,
  })
  @ValidateNested()
  @Type(() => RiskLevelCountsDto)
  riskLevelCounts!: RiskLevelCountsDto;

  @ApiProperty({
    description: 'Counts of violations by type',
    example: { PROHIBITED_CONTENT: 2, MISSING_INFORMATION: 1 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @IsObject()
  @Type(() => Object)
  violationCounts!: Record<string, number>;
}
