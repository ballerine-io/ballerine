import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UserAverageResolutionTimeModel {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'Average resolution time in milliseconds.' })
  @Transform(({ value }) => (value === null ? 0 : value))
  time!: number;
}
