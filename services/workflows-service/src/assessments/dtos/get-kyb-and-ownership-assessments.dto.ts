import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetKybAndOwnershipAssessmentsDto {
  @ApiProperty({
    description: 'Page number for pagination',
    type: Number,
    required: false,
    default: 1,
  })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsNumber()
  @IsOptional()
  page = 1;

  @ApiProperty({
    description: 'Number of items per page',
    type: Number,
    required: false,
    default: 20,
  })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsNumber()
  @IsOptional()
  limit = 20;

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
