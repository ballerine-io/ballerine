import { PageDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
export class GetTransactionsByAlertDto {
  @IsString()
  @MinLength(1)
  alertId!: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Column to sort by and direction separated by a colon',
    default: 'transactionDate:desc',
    examples: [
      { value: 'createdAt:asc' },
      { value: 'transactionDate:desc' },
      { value: 'status:asc' },
    ],
  })
  orderBy?: `${string}:asc` | `${string}:desc` = 'transactionDate:desc';

  @ApiProperty({ type: PageDto })
  @IsOptional()
  page?: PageDto = new PageDto();
}
