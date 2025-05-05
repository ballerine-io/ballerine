import { oneOf } from '@/common/decorators/one-of.decorator';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class InitiateIndividualVerificationAndSendEmailBody {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endUserCorrelationId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dateOfBirth?: string;

  @oneOf(['veriff'])
  vendor!: 'veriff';

  @IsBoolean()
  @IsOptional()
  withAml?: boolean;

  @IsBoolean()
  @IsOptional()
  ongoingMonitoring?: boolean;

  @IsString()
  @IsNotEmpty()
  language!: string;
}
