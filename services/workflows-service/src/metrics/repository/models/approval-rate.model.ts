import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ApprovalRateModel {
  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  approvalRate!: number;
}
