import { oneOf } from '@/common/decorators/one-of.decorator';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class InitiateIndividualVerificationAndSendEmailBody {
  @IsString()
  @IsNotEmpty()
  endUserId!: string;

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

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  revisionReason?: string;
}
