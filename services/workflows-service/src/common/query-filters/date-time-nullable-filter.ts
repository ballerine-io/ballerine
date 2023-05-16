import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class DateTimeNullableFilter {
  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  equals?: Date | null;

  @ApiProperty({
    required: false,
    type: [Date],
  })
  @IsOptional()
  @Type(() => Date)
  in?: Date[] | null;

  @ApiProperty({
    required: false,
    type: [Date],
  })
  @IsOptional()
  @Type(() => Date)
  notIn?: Date[] | null;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  lt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  lte?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  gt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  gte?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  not?: Date;
}
