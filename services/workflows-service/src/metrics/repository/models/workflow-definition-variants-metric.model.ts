import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class WorkflowDefinitionVariantsMetricModel {
  @IsString()
  workflowDefinitionVariant!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  count!: number;
}
