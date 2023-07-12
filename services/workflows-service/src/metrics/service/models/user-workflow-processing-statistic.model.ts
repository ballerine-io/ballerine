import { ApiProperty } from '@nestjs/swagger';

export class UserWorkflowProcessingStatisticModel {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  approvalRate!: number;

  @ApiProperty({ description: 'Average resolution time in milliseconds' })
  averageResolutionTime!: string;

  @ApiProperty({ description: 'Average assignment time in milliseconds' })
  averageAssignmentTime!: string;

  @ApiProperty({ description: 'Average review time in milliseconds' })
  averageReviewTime!: string;
}
