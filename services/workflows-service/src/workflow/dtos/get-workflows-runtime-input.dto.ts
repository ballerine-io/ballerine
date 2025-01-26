import { oneOf } from '@/common/decorators/one-of.decorator';
import { SortOrder } from '@/common/query-filters/sort-order';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkflowRuntimeDataStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetWorkflowsRuntimeInputDto {
  @IsOptional()
  @oneOf(Object.values(WorkflowRuntimeDataStatus), { each: true })
  @ApiPropertyOptional()
  status?: WorkflowRuntimeDataStatus[];

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  limit?: number;

  @Type(() => String)
  @ApiPropertyOptional({
    enum: [
      'workflowDefinitionName',
      'status',
      'state',
      'assignee',
      'resolvedAt',
      'createdBy',
      'createdAt',
    ],
    default: 'createdAt',
  })
  @Transform(({ value }) => value || 'createdAt')
  orderBy?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @Transform(({ value }) => value || 'desc')
  orderDirection?: SortOrder;
}
