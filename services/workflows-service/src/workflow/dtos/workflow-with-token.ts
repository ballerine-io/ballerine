import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class WorkflowWithToken {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  workflowDefinitionId!: string;
}
