import { DateQueryParamsDto } from '@/metrics/common/dto/date-query-params.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserCasesResolvedDailyDto extends DateQueryParamsDto {
  @ApiProperty()
  userId!: string;
}
