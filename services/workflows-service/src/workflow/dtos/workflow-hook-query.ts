import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import type { UnifiedCallbackNames } from '@/workflow/types/unified-callback-names';

export class WorkflowHookQuery {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  resultDestination?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  processName?: UnifiedCallbackNames;
}
