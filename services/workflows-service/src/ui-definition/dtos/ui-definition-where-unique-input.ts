import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@sinclair/typebox';
import { IsString } from 'class-validator';

export class UIDefinitionWhereUniqueInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;
}

export const UIDefinitionWhereUniqueInputSchema = Type.String({
  description: "The workflow's id",
});
