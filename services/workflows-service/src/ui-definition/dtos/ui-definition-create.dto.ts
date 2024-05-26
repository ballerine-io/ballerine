import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, MinLength } from 'class-validator';
import { UiDefinitionContext } from '@prisma/client';
import { oneOf } from '@/common/decorators/one-of.decorator';
import { Type } from 'class-transformer';
import { UiSchemaStep } from '@/collection-flow/models/flow-step.model';

export class UiDefinitionCreateDto {
  @ApiProperty({
    required: true,
    enum: UiDefinitionContext,
  })
  @oneOf(Object.values(UiDefinitionContext), { each: true })
  @IsString()
  uiContext!: keyof typeof UiDefinitionContext;

  @ApiProperty({
    required: true,
    type: Object,
  })
  @IsObject()
  @Type(() => UiSchemaStep)
  uiSchema!: UiSchemaStep;

  @ApiProperty({
    required: true,
    type: Object,
  })
  @IsObject()
  definition!: Record<PropertyKey, unknown>;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(1)
  workflowDefinitionId!: string;
}
