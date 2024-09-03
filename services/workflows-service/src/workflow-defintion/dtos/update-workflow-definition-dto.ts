import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import type { JsonValue } from 'type-fest';

export class UpdateWorkflowDefinitionDto {
  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsNotEmptyObject()
  definition!: JsonValue;
}
