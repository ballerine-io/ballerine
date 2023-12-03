import { DateQueryParamsDto } from '@/metrics/common/dto/date-query-params.dto';
import { IsOptional } from 'class-validator';

export class GetWorkflowRuntimesStatusCountDto extends DateQueryParamsDto {
  @IsOptional()
  // @ts-ignore
  fromDate!: Date;
}
