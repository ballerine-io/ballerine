import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  MinLength,
  ValidateNested,
  minLength,
} from 'class-validator';
import { BulkStatus } from '../types';
import type { TAlertUpdateResponse, TBulkStatus } from '../types';

export class AlertsIdsByProjectDto {
  @ApiProperty({
    type: Array<String>,
  })
  @Type(() => Array<String>)
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  alertIds!: string[];

  @ApiProperty({
    type: String,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @MinLength(1)
  projectId!: string;
}

export class AlertAssigneeUniqueDto extends AlertsIdsByProjectDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  assigneeId!: string;
}

export class AlertUpdateResponse {
  @ApiProperty({
    required: true,
    type: String,
  })
  alertId!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  status!: string;
}

export class BulkAssignAlertsResponse {
  @ApiProperty({
    required: true,
    enum: BulkStatus,
  })
  overallStatus!: TBulkStatus;

  @ApiProperty({
    required: true,
    type: Array,
    items: {
      type: 'object',
      properties: {
        alertId: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
      },
    },
  })
  @Type(() => Array<AlertUpdateResponse>)
  response!: TAlertUpdateResponse;
}
