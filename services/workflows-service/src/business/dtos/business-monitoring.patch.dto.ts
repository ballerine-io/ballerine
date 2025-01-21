import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class BusinessMonitoringPatchDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsIn(['on', 'off'])
  state!: 'on' | 'off';
}
