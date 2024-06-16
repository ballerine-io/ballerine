import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from '@sinclair/typebox';

export class WorkflowDefinitionWhereUniqueInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;
}

export const WorkflowDefinitionWhereUniqueInputSchema = Type.String({
  description: "The workflow's id",
});
