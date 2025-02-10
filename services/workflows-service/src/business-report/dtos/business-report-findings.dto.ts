import { ApiProperty } from '@nestjs/swagger';

export class FindingDto {
  @ApiProperty({ type: String })
  value!: string;

  @ApiProperty({ type: String })
  title!: string;
}

export class BusinessReportFindingsListResponseDto {
  @ApiProperty({ type: [FindingDto] })
  data!: Array<{ value: string; title: string }>;
}
