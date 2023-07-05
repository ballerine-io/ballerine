import { ApiProperty } from '@nestjs/swagger';

export class UserAverageAssignmentTimeModel {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'Average assignment time in milliseconds' })
  time!: number;
}
