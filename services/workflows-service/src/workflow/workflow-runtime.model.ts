import { ApiProperty } from '@nestjs/swagger';
import { WorkflowRuntimeDataStatus } from '@prisma/client';
import { IsDate, IsJSON, IsOptional, IsString } from 'class-validator';

export class WorkflowRuntimeModel {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  endUserId!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  businessId!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  assigneeId!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  workflowDefinitionId!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  workflowDefinitionVersion!: number;

  @ApiProperty({
    required: true,
    type: JSON,
  })
  @IsJSON()
  context!: JSON;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsString()
  state!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  status!: WorkflowRuntimeDataStatus;

  @ApiProperty({
    required: true,
    type: Date,
  })
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  resolvedAt!: Date;

  @ApiProperty({
    required: true,
    type: Date,
  })
  @IsDate()
  updatedAt!: Date;

  @ApiProperty()
  @IsString()
  createdBy!: string;
}
