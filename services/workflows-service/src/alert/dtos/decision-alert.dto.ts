import { ApiProperty } from '@nestjs/swagger';
import { AlertState } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { AlertsIdsByProjectDto } from './assign-alert.dto';

export class AlertDecisionDto {
  @ApiProperty({
    required: true,
    type: String,
    enum: AlertState,
  })
  @IsEnum(AlertState)
  decision!: AlertState;
}
