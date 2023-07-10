import { ApiProperty } from '@nestjs/swagger';

export class AverageAssignmentTimeModel {
  @ApiProperty({ description: 'Average assignment time in milliseconds' })
  time!: number;
}
