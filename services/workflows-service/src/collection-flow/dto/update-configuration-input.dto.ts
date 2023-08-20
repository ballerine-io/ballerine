import { FlowStepModel } from '@/collection-flow/models/flow-step.model';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class UpdateConfigurationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlowStepModel)
  steps!: FlowStepModel[];
}
