import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WorkflowDefinitionCloneDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;
}
