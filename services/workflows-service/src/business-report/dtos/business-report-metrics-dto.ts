import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

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
    description: 'Detected violations counts',
    example: [{ id: 'PROHIBITED_CONTENT', name: 'Prohibited content', count: 2 }],
    type: 'array',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ViolationCountDto)
  violationCounts!: ViolationCountDto[];
}

export class ViolationCountDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNumber()
  count!: number;
}
