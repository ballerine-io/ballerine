import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class ApprovalRateModel {
  @ApiProperty()
  @Transform(({ value }) => (!value ? '0' : value))
  approvalRate!: string;
}
