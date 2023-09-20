import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class WorkflowRuntimeStatusStatistic {}

export class WorkflowRuntimeStatisticModel {
  @ApiProperty({ description: 'Workflow Runtime Definition Id' })
  id!: string;

  @ApiProperty({ description: 'Workflow Runtime Definition name' })
  name!: string;

  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  active!: number;

  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  failed!: number;

  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  completed!: number;
}
