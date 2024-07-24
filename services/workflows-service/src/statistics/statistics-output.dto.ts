import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class ViolationsStatistics {
  @Type(() => String)
  name!: string;

  @Type(() => Number)
  count!: number;
}

export class StatisticsOutputDto {
  @ValidateNested({ each: true })
  @Type(() => ViolationsStatistics)
  violations!: ViolationsStatistics[];
}
