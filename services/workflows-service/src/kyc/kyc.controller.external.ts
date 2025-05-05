import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { type TProjectIds } from '@/types';
import { assertIsValidProjectIds } from '@/project/project-scope.service';
import { InitiateIndividualVerificationAndSendEmailBody } from './schemas';

@ApiBearerAuth()
@ApiTags('KYC')
@Controller('external/kyc')
export class KycControllerExternal {
  constructor(private readonly kycService: KycService) {}

  @Post()
  async initiateIndividualVerificationAndSendEmail(
    @Body()
    body: InitiateIndividualVerificationAndSendEmailBody,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    assertIsValidProjectIds(projectIds);

    return await this.kycService.initiateIndividualVerificationAndSendEmail({
      ...body,
      projectIds,
    });
  }
}
