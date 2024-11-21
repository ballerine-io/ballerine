import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class BusinessReportHookSearchQueryParamsDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(1)
  businessId!: string;
}
