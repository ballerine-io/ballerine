import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UiDefinitionContext } from '@prisma/client';
import { oneOf } from '@/common/decorators/one-of.decorator';

export class UiDefinitionByWorkflowDefinitionIdDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  workflowDefinitionId!: string;

  @ApiProperty({
    required: true,
    enum: ['back_office', 'collection_flow'],
  })
  @oneOf(Object.values(UiDefinitionContext), { each: true })
  @IsString()
  context!: typeof UiDefinitionContext;
}
