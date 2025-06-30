import { oneOf } from '@/common/decorators/one-of.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { ApprovalState } from '@prisma/client';

export class EndUserDecisionDto {
  @ApiProperty({
    description: 'Approval state decision',
    example: ApprovalState.APPROVED,
  })
  @oneOf([ApprovalState.APPROVED, ApprovalState.REJECTED])
  decision!: ApprovalState;
}
