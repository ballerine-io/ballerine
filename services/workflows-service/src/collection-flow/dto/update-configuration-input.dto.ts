import { UiSchemaStep } from '@/collection-flow/models/flow-step.model';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';

export class UpdateConfigurationDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UiSchemaStep)
  steps!: UiSchemaStep[];

  @IsObject()
  @IsOptional()
  theme?: object;
}
