import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, MinLength } from 'class-validator';
import type { TAlertUpdateResponse, TBulkStatus } from '../types';
import { BulkStatus } from '../types';
import { IsNullable } from '@/common/decorators/is-nullable.decorator';

export class AlertsIdsByProjectDto {
  @ApiProperty({
    // eslint-disable-next-line @typescript-eslint/ban-types
    type: Array<String>,
  })
  // eslint-disable-next-line @typescript-eslint/ban-types
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

export class AlertAssigneeUniqueDto {
  @ApiProperty({
    // eslint-disable-next-line @typescript-eslint/ban-types
    type: Array<String>,
  })
  // eslint-disable-next-line @typescript-eslint/ban-types
  @Type(() => Array<String>)
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  alertIds!: string[];

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsNullable()
  assigneeId!: string | null;
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

export class BulkAlertsResponse {
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
