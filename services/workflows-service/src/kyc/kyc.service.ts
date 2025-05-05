import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { EndUserService } from '@/end-user/end-user.service';
import { type TProjectIds } from '@/types';

export class KycService {
  private readonly axiosClient: AxiosInstance;

  constructor(
    private readonly unifiedApiClient: UnifiedApiClient,
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
    private readonly endUserService: EndUserService,
  ) {
    this.axiosClient = this.httpService.axiosRef;
  }

  async initiateIndividualVerification(data: {
    endUserId: string;
    sessionId: string | undefined;
    clientId: string;

    vendor: 'veriff';
    withAml: boolean;
    ongoingMonitoring: boolean;
    callbackUrl: string;

    firstName: string;
    lastName: string;
    dateOfBirth?: string;
  }) {
    const response = await this.unifiedApiClient.runIndividualVerification(data);

    return response.data;
  }

  async sendIndividualVerificationEmail({
    customerName,
    companyName,
    email,
    firstName,
    kycLink,
    language,
    revisionReason,
  }: {
    customerName: string;
    companyName: string;
    email: string;
    firstName: string;
    kycLink: string;
    language: string;
    revisionReason: string | undefined;
  }) {
    const EMAIL_API_URL = this.configService.get('EMAIL_API_URL');
    const EMAIL_API_TOKEN = this.configService.get('EMAIL_API_TOKEN');
    const payload = {
      from: {
        email: 'no-reply@ballerine.com',
        name: `${customerName} Team`,
      },
      personalizations: [
        {
          subject: `${customerName} activation, Action needed.`,
          to: [{ email }],
          dynamic_template_data: {
            kybCompanyName: companyName,
            customerCompanyName: customerName,
            firstName,
            kycLink,
            language,
            supportEmail: `support@${customerName}.com`,
            revisionReason,
          },
        },
      ],
      template_id: revisionReason
        ? 'd-2c6ae291d9df4f4a8770d6a4e272d803'
        : 'd-61c568cfa5b145b5916ff89790fe2065',
    };

    if (!EMAIL_API_URL) {
      this.logger.error('No EMAIL_API_URL defined');

      throw new InternalServerErrorException('No EMAIL_API_URL defined');
    }

    if (!EMAIL_API_TOKEN) {
      this.logger.error('No EMAIL_API_TOKEN defined');

      throw new InternalServerErrorException('No EMAIL_API_TOKEN defined');
    }

    const emailResponse = await this.axiosClient.post(EMAIL_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${EMAIL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    return emailResponse.data;
  }

  async initiateIndividualVerificationAndSendEmail({
    endUserId,
    vendor,
    withAml,
    ongoingMonitoring,
    language,
    revisionReason,
    projectIds,
  }: {
    endUserId: string;

    vendor: 'veriff';
    withAml?: boolean;
    ongoingMonitoring?: boolean;
    language: string;
    revisionReason: string | undefined;
    projectIds: NonNullable<TProjectIds>;
  }) {
    const endUser = await this.endUserService.getById(
      endUserId,
      {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      projectIds,
    );

    if (!endUser.email) {
      throw new BadRequestException('End-user email is required');
    }

    const { id: sessionId, url: kycLink } = await this.initiateIndividualVerification({
      endUserId: endUser.id,
      // TODO: Get from KYC check table
      sessionId: undefined,
      clientId: 'anonymous',

      vendor,
      withAml: withAml ?? true,
      ongoingMonitoring: ongoingMonitoring ?? false,
      callbackUrl: `https://webhook.site/5bf8746c-399a-445d-8f6d-830bd8140b19k`,

      firstName: endUser.firstName,
      lastName: endUser.lastName,
      dateOfBirth: endUser.dateOfBirth?.toISOString().split('T')[0] ?? undefined,
    });

    await this.sendIndividualVerificationEmail({
      firstName: endUser.firstName,
      kycLink,
      email: endUser.email,
      customerName: 'anonymous',
      companyName: 'anonymous',
      language,
      revisionReason,
    });

    return {
      checkId: '',
      sessionId,
      url: kycLink,
    };
  }
}
