import { DateQueryParamsDto } from '@/metrics/common/dto/date-query-params.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetUserWorkflowProcessingStatisticDto extends DateQueryParamsDto {
  constructor() {
    super();
    this.userId = null;
  }

  @ApiProperty()
  @Transform(({ value }) => (!value ? null : value))
  userId!: string | null;
}
