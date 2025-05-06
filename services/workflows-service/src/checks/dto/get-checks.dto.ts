import { oneOf } from '@/common/decorators/one-of.decorator';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetChecksDto {
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
    description: 'Type of check',
    type: String,
    required: false,
    default: 'kyb_and_ownership',
    enum: ['kyb_and_ownership'],
  })
  @IsString()
  @oneOf(['kyb_and_ownership'])
  @IsOptional()
  checkType: string = 'kyb_and_ownership';
}
