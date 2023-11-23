import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UiDefinitionContext } from '@prisma/client';
import { oneOf } from '@/common/decorators/one-of.decorator';
import type { ObjectValues } from '@/types';

export const uiDefinitionContextValues = Object.values(UiDefinitionContext);

export class UiDefinitionByWorkflowDefinitionIdDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  workflowDefinitionId!: string;

  @ApiProperty({
    required: true,
    enum: uiDefinitionContextValues,
  })
  @oneOf(uiDefinitionContextValues, { each: true })
  @IsString()
  uiContext!: ObjectValues<typeof UiDefinitionContext>;
}
