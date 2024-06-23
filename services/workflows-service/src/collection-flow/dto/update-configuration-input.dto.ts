import { UiSchemaStep } from '@/collection-flow/models/flow-step.model';
import { IsArray, IsObject, IsOptional } from 'class-validator';

export class UpdateConfigurationDto {
  @IsOptional()
  @IsArray()
  steps!: UiSchemaStep[];

  @IsObject()
  @IsOptional()
  theme?: object;
}
