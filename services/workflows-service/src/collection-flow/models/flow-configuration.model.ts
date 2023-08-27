import { DocumentConfiguration, FlowStepModel } from '@/collection-flow/models/flow-step.model';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class FlowConfigurationModel {
  @IsString()
  id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlowStepModel)
  steps!: FlowStepModel[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentConfiguration)
  documentConfigurations!: DocumentConfiguration[];
}
