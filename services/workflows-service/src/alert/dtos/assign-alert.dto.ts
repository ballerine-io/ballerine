import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsString, MinLength } from 'class-validator';
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

export class ErrorResponse {
  @ApiProperty({ required: true, type: String })
  message!: string;
}

export class AlertUpdateResponse {
  @ApiProperty({
    required: true,
    type: String,
  })
  alertId!: string;

  @ApiProperty({ required: true })
  @IsEnum(BulkStatus)
  status!: typeof BulkStatus;

  @ApiProperty({ required: false, type: [ErrorResponse] })
  @IsArray()
  @Type(() => ErrorResponse)
  errors?: ErrorResponse[];
}
