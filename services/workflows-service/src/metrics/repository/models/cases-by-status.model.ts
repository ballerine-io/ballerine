import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CasesByStatusMetricModel {
  @ApiProperty()
  @IsNumber()
  count!: number;

  @ApiProperty()
  @IsString()
  status!: string;
}
