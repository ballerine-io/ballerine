import { QueryMode } from './query-mode';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class StringNullableFilter {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  equals?: string | null;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @Type(() => String)
  in?: string[] | null;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @Type(() => String)
  notIn?: string[] | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  lt?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  lte?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  gt?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  gte?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  contains?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  startsWith?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  endsWith?: string;

  @ApiProperty({
    required: false,
    enum: ['Default', 'Insensitive'],
  })
  @IsOptional()
  mode?: QueryMode;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  not?: string;
}
