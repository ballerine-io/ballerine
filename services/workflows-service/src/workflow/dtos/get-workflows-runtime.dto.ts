import { oneOf } from '@/common/decorators/one-of.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkflowRuntimeDataStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetWorkflowsRuntimeDto {
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
}
