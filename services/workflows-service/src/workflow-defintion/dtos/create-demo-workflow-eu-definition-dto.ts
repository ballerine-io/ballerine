import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDemoWorkflowDefinitionEuDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  customerId!: string;
}
