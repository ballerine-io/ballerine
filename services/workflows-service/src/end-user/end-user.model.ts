import { StringFilter } from '@/common/query-filters/string-filter';
import { ApiProperty } from '@nestjs/swagger';
import { ApprovalState } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, IsPhoneNumber } from 'class-validator';
import type { JsonValue } from 'type-fest';

export class EndUserModel {
  @ApiProperty({
    required: true,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  id!: string;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  avatarUrl?: string | null;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @IsOptional()
  @Type(() => StringFilter)
  correlationId?: string | null;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @IsOptional()
  @Type(() => StringFilter)
  verificationId?: string | null;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  endUserType?: string | null;

  @ApiProperty({
    required: false,
    enum: ['APPROVED', 'REJECTED', 'PROCESSING', 'NEW'],
  })
  @IsOptional()
  approvalState?: ApprovalState;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  stateReason?: string | null;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  jsonData?: JsonValue;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsEmail()
  @IsOptional()
  email?: string | null;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsPhoneNumber()
  @IsOptional()
  phone?: string | null;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  additionalInfo?: JsonValue;

  //   @ApiProperty({
  //     required: false,
  //     type: () => WorkflowRuntimeDataWhereUniqueInput,
  //   })
  //   @ValidateNested()
  //   @Type(() => WorkflowRuntimeDataWhereUniqueInput)
  //   @IsOptional()
  //   workflowRuntimeData?: WorkflowRuntimeDataWhereUniqueInput;
  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  createdAt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  updatedAt?: Date;
}
