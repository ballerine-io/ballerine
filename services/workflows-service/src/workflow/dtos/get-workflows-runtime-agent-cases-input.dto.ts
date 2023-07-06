import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class GetWorkflowsRuntimeAgentCases {
  @ApiProperty({ type: Number, description: 'UNIX timestamp' })
  @IsOptional()
  @Transform(({ value }) => new Date(value ? +value : 0))
  @IsDate()
  fromDate!: Date;
}
