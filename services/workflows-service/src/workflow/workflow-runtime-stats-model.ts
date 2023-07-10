import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class WorkflowDefinitionRuntimeStats {
  @ApiProperty()
  active!: number;

  @ApiProperty()
  failed!: number;

  @ApiProperty()
  completed!: number;
}

export class WorkflowRuntimeStatsModel {
  @Type(() => String)
  @ApiProperty({ description: 'Workflow Runtime Definition Id' })
  id!: string;

  @Type(() => String)
  @ApiProperty({ description: 'Workflow Runtime Definition name' })
  name!: string;

  @Type(() => WorkflowDefinitionRuntimeStats)
  @ApiProperty()
  @ValidateNested()
  stats!: WorkflowDefinitionRuntimeStats;
}
