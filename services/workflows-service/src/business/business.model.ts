import { StringFilter } from '@/common/query-filters/string-filter';
import { ApiProperty } from '@nestjs/swagger';
import { ApprovalState } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class BusinessModel {
  @ApiProperty({
    required: true,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  id!: string;

  @ApiProperty({
    required: true,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  companyName!: string | null;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  registrationNumber?: string | null;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @IsOptional()
  @Type(() => StringFilter)
  legalForm?: string | null;

  @ApiProperty({
    required: true,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  countryOfIncorporation!: string | null;
  // dateOfIncorporation: Date | null
  // address: string
  // phoneNumber: string | null
  // email: string | null
  // website: string | null
  // industry: string
  // taxIdentificationNumber: string | null
  // vatNumber: string | null
  // shareholderStructure: Prisma.JsonValue | null
  // numberOfEmployees: number | null
  // businessPurpose: string | null
  // documents: Prisma.JsonValue
  // status: ApprovalState
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
