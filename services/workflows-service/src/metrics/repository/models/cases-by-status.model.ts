import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CasesByStatusMetric {
  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  count!: number;

  @ApiProperty()
  status!: string;
}
