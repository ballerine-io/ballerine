import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class DocumentDecisionUpdateInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsIn(['approve', 'reject', 'revision', 'revised'])
  decision!: 'approve' | 'reject' | 'revision' | 'revised';

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
