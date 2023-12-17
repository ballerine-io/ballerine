import { UiDefDefinition, UiSchemaStep } from '@/collection-flow/models/flow-step.model';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import type { WorkflowConfig } from '@/workflow/schemas/zod-schemas';

export class FlowConfigurationModel {
  @IsString()
  id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UiSchemaStep)
  uiSchema!: UiSchemaStep[];

  @IsObject()
  @IsOptional()
  definition?: UiDefDefinition;

  @IsObject()
  @IsOptional()
  config?: WorkflowConfig;
}
