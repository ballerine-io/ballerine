import { ApiProperty } from '@nestjs/swagger';
import { AlertState } from '@prisma/client';
import { ArrayMinSize, IsArray, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AlertDecisionDto {
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
    enum: AlertState,
  })
  @IsEnum(AlertState)
  decision!: AlertState;
}
