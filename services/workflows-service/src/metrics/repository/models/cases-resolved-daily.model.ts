import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CasesResolvedInDay {
  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  count!: number;

  @ApiProperty()
  date!: string;
}
