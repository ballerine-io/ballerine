import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DocumentDecisionParamsInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  workflowId!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  documentId!: string;
}
