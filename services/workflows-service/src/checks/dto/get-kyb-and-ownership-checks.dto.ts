import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetKybAndOwnershipChecksDto {
  @ApiProperty({
    description: 'Page number for pagination',
    type: Number,
    required: false,
    default: 0,
  })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsNumber()
  @IsOptional()
  page: number = 0;

  @ApiProperty({
    description: 'Number of items per page',
    type: Number,
    required: false,
    default: 20,
  })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsNumber()
  @IsOptional()
  limit: number = 20;

  @ApiProperty({
    description: 'Filter by status',
    type: String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  status?: string[];

  @ApiProperty({
    description: 'Filter by start date',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty({
    description: 'Filter by end date',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  to?: string;
}
