import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

export class KycService {
  private readonly axiosClient: AxiosInstance;

  constructor(
    private readonly unifiedApiClient: UnifiedApiClient,
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.axiosClient = this.httpService.axiosRef;
  }

  async initiateIndividualVerification(data: any) {
    const response = await this.unifiedApiClient.runIndividualVerification(data);

    return response.data;
  }

  async sendIndividualVerificationEmail(data: {
    customerCompany: string;
    companyName: string;
    email: string;
    firstName: string;
    kycLink: string;
    language: string;
    revisionReason: string;
  }) {
    const payload = {
      from: {
        email: 'no-reply@ballerine.com',
        name: `${data.customerCompany} Team`,
      },
      personalizations: [
        {
          subject: `${data.customerCompany} activation, Action needed.`,
          to: [{ email: data.email }],
          dynamic_template_data: {
            kybCompanyName: data.companyName,
            customerCompanyName: data.customerCompany,
            firstName: data.firstName,
            kycLink: data.kycLink,
            language: data.language,
            supportEmail: `support@${data.customerCompany}.com`,
            revisionReason: data.revisionReason,
          },
        },
      ],
      template_id: 'd-61c568cfa5b145b5916ff89790fe2065',
    };

    const emailResponse = await this.axiosClient.post(
      this.configService.get('EMAIL_API_URL')!,
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get('EMAIL_API_TOKEN')!}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return emailResponse.data;
  }

  async initiateIndividualVerificationAndSendEmail(data: any) {
    const individualVerification = await this.initiateIndividualVerification(data);

    return await this.sendIndividualVerificationEmail({
      ...data,
      kycLink: individualVerification.url,
    });
  }
}

@ApiBearerAuth()
@ApiTags('Documents')
@Controller('external/kyc')
export class KycControllerExternal {
  constructor(private readonly kycService: KycService) {}

  @Post('individual-verification')
  @ApiResponse({
    status: 200,
    description: 'Individuals verification initiated successfully',
    schema: Type.Any(),
  })
  @Validate({
    request: [
      {
        type: 'body',
        schema: Type.Any(),
      },
    ],
    response: Type.Any(),
  })
  async individualsVerification(
    @Body()
    data: any,
  ) {
    return await this.kycService.initiateIndividualVerification(data);
  }

  @Post('send-email')
  async sendEmail(@Body() data: any) {
    return await this.kycService.sendIndividualVerificationEmail(data);
  }

  @Post('initiate-individual-verification-and-send-email')
  async initiateIndividualVerificationAndSendEmail(@Body() data: any) {
    return await this.kycService.initiateIndividualVerificationAndSendEmail(data);
  }
}
