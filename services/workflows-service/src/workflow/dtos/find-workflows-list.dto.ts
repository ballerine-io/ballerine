import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export class FindWorkflowsListDto {
  @ApiProperty({
    required: false,
  })
  filterId!: string;
}

export const FindWorkflowsListSchema = z.object({
  filterId: z.string(),
});
