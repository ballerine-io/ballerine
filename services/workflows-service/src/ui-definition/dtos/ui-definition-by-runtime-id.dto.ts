import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UiDefinitionContext } from '@prisma/client';
import { oneOf } from '@/common/decorators/one-of.decorator';

export class UiDefinitionByRuntimeIdDto {
  @ApiProperty({
    required: true,
    enum: UiDefinitionContext,
  })
  @oneOf(Object.values(UiDefinitionContext), { each: true })
  @IsString()
  uiContext!: keyof typeof UiDefinitionContext;
}
