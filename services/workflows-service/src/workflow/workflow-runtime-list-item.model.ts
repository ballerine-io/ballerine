import { IsNullable } from '@/common/decorators/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkflowRuntimeDataStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDate, IsJSON, IsString, ValidateNested } from 'class-validator';

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
  @ApiProperty()
  @IsString()
  id!: string;

  @Expose()
  @ApiProperty()
  @IsString()
  workflowDefinitionName!: string;

  @Expose()
  @ApiProperty()
  @IsString()
  workflowDefinitionId!: string;

  @Expose()
  @ApiProperty()
  @IsString()
  status!: WorkflowRuntimeDataStatus;

  @Expose()
  @ApiProperty()
  @IsJSON()
  context!: JSON;

  @Expose()
  @IsNullable()
  @IsString()
  state!: string | null;

  @Expose()
  @IsNullable()
  @ValidateNested()
  assignee!: WorkflowAssignee | null;

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
}
