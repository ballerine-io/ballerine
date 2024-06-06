import { IsNullable } from '@/common/decorators/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class DocumentDecisionUpdateInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNullable()
  @IsIn(['approve', 'reject', 'revision', 'revised'])
  decision!: 'approve' | 'reject' | 'revision' | 'revised' | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
