import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class OngoingMonitoringPatchDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsIn(['active', 'inactive'])
  status!: 'active' | 'inactive';
}
