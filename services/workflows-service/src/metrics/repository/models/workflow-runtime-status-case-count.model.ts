import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class WorkflowRuntimeStatusCaseCountModel {
  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  active!: number;

  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  completed!: number;

  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  failed!: number;
}
