import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export class FindWorkflowParamsDto {
  @ApiProperty()
  id!: string;
}

export class FindWorkflowQueryDto {
  @ApiProperty()
  filterId!: string;
}

export const FindWorkflowQuerySchema = z.object({
  filterId: z.string(),
});
