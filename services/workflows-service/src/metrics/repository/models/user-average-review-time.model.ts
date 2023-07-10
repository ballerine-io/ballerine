import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UserAverageReviewTimeModel {
  @ApiProperty({ description: 'Average review time in milliseconds' })
  @Transform(({ value }) => (value === null ? 0 : value))
  time!: number;
}
