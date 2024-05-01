import { ApiProperty } from '@nestjs/swagger';
import { BusinessReportType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GetBusinessReportsDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  businessId!: string;

  @ApiProperty({
    required: true,
  })
  @IsIn(Object.values(BusinessReportType))
  type!: BusinessReportType;
}
