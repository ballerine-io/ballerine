import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { oneOf } from '@/common/decorators/one-of.decorator';

export class GetAssessmentsDto {
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
    description: 'Type of check',
    type: String,
    required: false,
    default: 'kyb_and_ownership',
    enum: ['kyb_and_ownership'],
  })
  @IsString()
  @oneOf(['kyb_and_ownership'])
  @IsOptional()
  checkType = 'kyb_and_ownership';
}
