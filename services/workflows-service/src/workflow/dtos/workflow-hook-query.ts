import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UnifiedCallbackNames } from '@/workflow/types/unified-callback-names';

export class WorkflowHookQuery {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  resultDestination?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  processName?: UnifiedCallbackNames;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  projectId!: string;
}
