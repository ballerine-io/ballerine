import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export const Direction = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export class StatisticsInputDto {
  @ApiProperty({ required: true, enum: Direction })
  @IsEnum(Direction)
  violationsDirection!: (typeof Direction)[keyof typeof Direction];
}
