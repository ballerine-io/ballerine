import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BusinessMonitoringPatchDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  state!: 'on' | 'off';

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  userReason?: string;
}
