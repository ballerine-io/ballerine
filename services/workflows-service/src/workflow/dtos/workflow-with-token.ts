import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  salesforceObjectName?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  salesforceRecordId?: string;
}
