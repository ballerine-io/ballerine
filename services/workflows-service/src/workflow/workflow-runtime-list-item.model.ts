import { IsNullable } from '@/common/decorators/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkflowRuntimeDataStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsJSON,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class WorkflowAssignee {
  @Expose()
  @IsNullable()
  @IsString()
  firstName!: string;

  @Expose()
  @IsNullable()
  @IsString()
  lastName!: string;
}

export class WorkflowRuntimeListItemModel {
  @Expose()
  @ApiProperty({ required: true, type: String })
  @IsString()
  id!: string;

  @Expose()
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNullable()
  @IsString()
  salesforceObjectName?: string | null;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNullable()
  @IsString()
  salesforceRecordId?: string | null;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNullable()
  @IsString()
  parentRuntimeDataId?: string | null;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  endUserId?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  uiDefinitionId?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  workflowDefinitionVersion?: number;

  @Expose()
  @ApiProperty({ required: true, type: String })
  @IsString()
  workflowDefinitionName!: string;

  @Expose()
  @ApiProperty({ required: true, type: String })
  @IsString()
  workflowDefinitionId!: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: 'object',
  })
  @IsNotEmptyObject()
  workflowDefinition!: object;

  @Expose()
  @ApiProperty()
  @IsString()
  status!: WorkflowRuntimeDataStatus;

  @Expose()
  @ApiProperty({
    required: true,
    type: 'object',
  })
  @IsJSON()
  context!: JSON;

  @Expose()
  @ApiProperty({
    required: true,
    type: 'object',
  })
  @IsJSON()
  config!: JSON;

  @Expose()
  @IsNullable()
  @IsString()
  @ApiProperty({ required: true, type: String })
  state!: string | null;

  @Expose()
  @IsNullable()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;

  @Expose()
  @IsNullable()
  @IsOptional()
  @ValidateNested()
  assignee?: WorkflowAssignee | null;

  @Expose()
  @IsString()
  createdBy!: string;

  @Expose()
  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  @IsDate()
  resolvedAt!: Date;

  @Expose()
  @ApiProperty()
  @IsDate()
  updatedAt!: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  assignedAt?: Date;
}
