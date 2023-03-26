import { ApiProperty } from '@nestjs/swagger';
import { WorkflowDefinitionWhereInput } from './workflow-definition-where-input';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class WorkflowDefinitionListRelationFilter {
  @ApiProperty({
    required: false,
    type: () => WorkflowDefinitionWhereInput,
  })
  @ValidateNested()
  @Type(() => WorkflowDefinitionWhereInput)
  @IsOptional()
  every?: WorkflowDefinitionWhereInput;

  @ApiProperty({
    required: false,
    type: () => WorkflowDefinitionWhereInput,
  })
  @ValidateNested()
  @Type(() => WorkflowDefinitionWhereInput)
  @IsOptional()
  some?: WorkflowDefinitionWhereInput;

  @ApiProperty({
    required: false,
    type: () => WorkflowDefinitionWhereInput,
  })
  @ValidateNested()
  @Type(() => WorkflowDefinitionWhereInput)
  @IsOptional()
  none?: WorkflowDefinitionWhereInput;
}
