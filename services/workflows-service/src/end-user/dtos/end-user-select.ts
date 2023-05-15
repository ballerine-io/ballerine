import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class EndUserSelect {
  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  id?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  correlationId?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  verificationId?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  endUserType?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  approvalState?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  stateReason?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  jsonData?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  firstName?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  lastName?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  email?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  phone?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  dateOfBirth?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  avatarUrl?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  additionalInfo?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  createdAt?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  updatedAt?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  workflowRuntimeData?: boolean;
  // | EndUser$workflowRuntimeDataArgs

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  businesses?: boolean;
  // | EndUser$businessesArgs

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  endUsersOnBusinesses?: boolean;
  // | EndUser$EndUsersOnBusinessesArgs

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  _count?: boolean;
  // | EndUserCountOutputTypeArgs
}
