import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class FlowConfigurationModel {
  @IsString()
  id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlowConfigurationModel)
  steps!: FlowConfigurationModel[];
}
