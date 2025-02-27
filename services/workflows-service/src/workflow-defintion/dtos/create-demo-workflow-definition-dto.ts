import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDemoWorkflowDefinitionDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  customer!: string;
}
