import { PageDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import z from 'zod';

export class GetKybAndOwnershipAssessmentsDto {
  @ApiProperty({ type: PageDto })
  page!: PageDto;

  @ApiProperty({
    description: 'Filter by status',
    type: String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  status?: string[];

  @ApiProperty({
    description: 'Filter by start date',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty({
    description: 'Filter by end date',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  to?: string;
}

export const GetKybAndOwnershipAssessmentsSchema = z.object({
  page: z.object({
    number: z.coerce.number().int().positive(),
    size: z.coerce.number().int().positive().max(100),
  }),
});
