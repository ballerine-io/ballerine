import { DateTimeFilter } from '@/query-filters/date-time-filter';
import { StringFilter } from '@/query-filters/string-filter';
import { StringNullableFilter } from '@/query-filters/string-nullable-filter';
import { ApiProperty } from '@nestjs/swagger';
import { ApprovalState } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class EndUserWhereInput {
  @ApiProperty({
    required: true,
    type: StringFilter,
  })
  @Type(() => StringFilter)
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
  state?: ApprovalState;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @Type(() => StringNullableFilter)
  @IsOptional()
  stateReason?: StringNullableFilter;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @Type(() => StringNullableFilter)
  @IsOptional()
  firstName?: StringNullableFilter;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @Type(() => StringNullableFilter)
  @IsOptional()
  lastName?: StringNullableFilter;

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
