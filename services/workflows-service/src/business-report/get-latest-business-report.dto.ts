import { ApiProperty } from '@nestjs/swagger';
import { BusinessReportType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetLatestBusinessReportDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  businessId!: string;

  @ApiProperty({
    required: false,
  })
  @IsIn(Object.values(BusinessReportType))
  @IsOptional()
  type?: BusinessReportType;
}
