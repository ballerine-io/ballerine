import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AverageReviewTimeModel {
  @ApiProperty({ description: 'Average review time in milliseconds' })
  @Transform(({ value }) => (!value ? 0 : value.split('.')[0]))
  time!: string;
}
