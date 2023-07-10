import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AverageResolutionTimeModel {
  @ApiProperty({ description: 'Average resolution time in milliseconds.' })
  @Transform(({ value }) => (value === null ? 0 : value))
  time!: number;
}
