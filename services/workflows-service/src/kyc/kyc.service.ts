import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { BadRequestException, InternalServerErrorException, Injectable } from '@nestjs/common';
import { EndUserService } from '@/end-user/end-user.service';
import { type TProjectIds } from '@/types';
import { CustomerService } from '@/customer/customer.service';
@Injectable()
export class KycService {
  private readonly axiosClient: AxiosInstance;

  constructor(
    private readonly unifiedApiClient: UnifiedApiClient,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
    private readonly endUserService: EndUserService,
    private readonly customerService: CustomerService,
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
    email,
    firstName,
    kycLink,
    language,
    customerName,
  }: {
    email: string;
    firstName: string;
    kycLink: string;
    language: string;
    customerName: string;
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
            firstName,
            kycLink,
            language,
            customerName,
          },
        },
      ],
      template_id: 'd-7843c28e3653430597c9e8d0b8f14bd0',
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
    endUserCorrelationId,
    firstName,
    lastName,
    email,
    dateOfBirth,
    vendor,
    withAml,
    ongoingMonitoring,
    language,
    projectIds,
  }: {
    endUserCorrelationId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: string;

    vendor: 'veriff';
    withAml?: boolean;
    ongoingMonitoring?: boolean;
    language: string;
    projectIds: NonNullable<TProjectIds>;
  }) {
    let endUser;

    if (!endUserCorrelationId) {
      endUser = await this.endUserService.create({
        data: {
          firstName: firstName!,
          lastName: lastName!,
          email: email!,
          dateOfBirth: dateOfBirth!,
          projectId: projectIds[0]!,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
    }

    if (endUserCorrelationId) {
      endUser = await this.endUserService.getByCorrelationId(endUserCorrelationId, projectIds, {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
    }

    if (!endUser) {
      endUser = await this.endUserService.create({
        data: {
          correlationId: endUserCorrelationId,
          firstName: firstName!,
          lastName: lastName!,
          email: email!,
          dateOfBirth: new Date(dateOfBirth!),
          projectId: projectIds[0]!,
        },
      });
    }

    if (!endUser.email) {
      throw new BadRequestException('End-user email is required');
    }

    const customer = await this.customerService.getByProjectId(projectIds[0]!, {
      select: {
        name: true,
        displayName: true,
      },
    });

    const {
      id: sessionId,
      url: kycLink,
      checkId,
    } = await this.initiateIndividualVerification({
      endUserId: endUser.id,
      // TODO: Get from KYC check table
      sessionId: undefined,
      clientId: customer.name,

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
      customerName: customer.displayName,
      language,
    });

    return {
      checkId,
      sessionId,
      url: kycLink,
    };
  }
}
