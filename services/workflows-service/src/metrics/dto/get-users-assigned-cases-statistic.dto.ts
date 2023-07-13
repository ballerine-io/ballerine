import { DateQueryParamsDto } from '@/metrics/common/dto/date-query-params.dto';
import { IsOptional } from 'class-validator';

export class GetUsersAssignedCasesStatisticDto extends DateQueryParamsDto {
  @IsOptional()
  fromDate!: Date;
}
