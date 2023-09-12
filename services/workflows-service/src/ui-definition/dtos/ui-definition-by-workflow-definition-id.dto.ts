import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { UiDefinitionContext } from '@prisma/client';

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
  @IsEnum(['back_office', 'collection_flow'])
  context!: typeof UiDefinitionContext;
}
