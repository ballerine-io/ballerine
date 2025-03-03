import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { UpdateableReportStatus } from '@ballerine/common';

export class BusinessReportStatusUpdateRequestParamsDto {
  @IsString()
  @ApiProperty({ type: String, required: true })
  reportId!: string;

  @IsString()
  @ApiProperty({ type: String, required: true })
  status!: UpdateableReportStatus;
}
