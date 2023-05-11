import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FloatFilter {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  equals?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  in?: number[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Type(() => Number)
  notIn?: number[];

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  lt?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  lte?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  gt?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  gte?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  not?: number;
}
