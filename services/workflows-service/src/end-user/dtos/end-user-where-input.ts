import { DateTimeFilter } from '@/common/query-filters/date-time-filter';
import { StringNullableFilter } from '@/common/query-filters/string-nullable-filter';
import { ApiProperty } from '@nestjs/swagger';
import { ApprovalState } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { StringFilter } from '@/common/query-filters/string-filter';

export class EndUserWhereInput {
  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  correlationId?: StringFilter;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @IsOptional()
  @Type(() => StringNullableFilter)
  verificationId?: StringNullableFilter;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @Type(() => StringNullableFilter)
  @IsOptional()
  endUserType?: StringNullableFilter;

  @ApiProperty({
    required: false,
    enum: ['APPROVED', 'REJECTED', 'PROCESSING', 'NEW'],
  })
  @IsOptional()
  // Incorrect type - would be a lot of time and effort to type this correctly.
  approvalState?: ApprovalState;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @Type(() => StringNullableFilter)
  @IsOptional()
  stateReason?: StringNullableFilter;

  @ApiProperty({
    required: true,
    type: String,
  })
  @Type(() => String)
  firstName!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @Type(() => String)
  lastName!: string;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @Type(() => StringNullableFilter)
  @IsEmail()
  @IsOptional()
  email?: StringNullableFilter;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @Type(() => StringNullableFilter)
  @IsPhoneNumber()
  @IsOptional()
  phone?: StringNullableFilter;

  @ApiProperty({
    required: false,
    type: DateTimeFilter,
  })
  @Type(() => DateTimeFilter)
  createdAt?: DateTimeFilter;

  @ApiProperty({
    required: false,
    type: DateTimeFilter,
  })
  @Type(() => DateTimeFilter)
  updatedAt?: DateTimeFilter;
}
