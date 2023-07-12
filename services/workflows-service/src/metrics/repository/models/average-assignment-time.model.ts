import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AverageAssignmentTimeModel {
  @ApiProperty({ description: 'Average assignment time in milliseconds' })
  @Transform(({ value }) => (!value ? 0 : value.split('.')[0]))
  time!: string;
}
