import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { BadRequestException, InternalServerErrorException, Injectable } from '@nestjs/common';
import { EndUserService } from '@/end-user/end-user.service';
import { TProjectId } from '@/types';
import { CustomerService } from '@/customer/customer.service';
import { isType } from '@ballerine/common';
import z from 'zod';

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
    workflowRuntimeDataId: string;
    sessionId: string | undefined;
    clientId: string;
    vendor: 'veriff';
    withAml: boolean;
    ongoingMonitoring: boolean;
    callbackUrl: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    projectId: string;
    customerId?: string;
    // Bio-facial fields — optional, forwarded to Unified API when provided
    documents?: Array<{
      type?: string;
      frontImage?: string;
      backImage?: string;
      documentNumber?: string;
    }>;
    biometricData?: { facialImages?: string[] };
    idNumber?: string;
    phoneNumber?: string;
    country?: string;
    methods?: string[];
    performDeduplication?: boolean;
    requireLivenessForEnrollment?: boolean;
    facialDeduplication?: {
      enabled?: boolean;
      threshold?: number;
      maxResults?: number;
    };
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
    companyName,
    revisionReason,
  }: {
    email: string;
    firstName: string;
    kycLink: string;
    language: string;
    customerName: string;
    companyName: string;
    revisionReason: string | undefined;
  }) {
    const EMAIL_API_URL = this.configService.get('EMAIL_API_URL');
    const EMAIL_API_TOKEN = this.configService.get('EMAIL_API_TOKEN');

    if (!EMAIL_API_URL) {
      this.logger.error('No EMAIL_API_URL defined');

      throw new InternalServerErrorException('No EMAIL_API_URL defined');
    }

    if (!EMAIL_API_TOKEN) {
      this.logger.error('No EMAIL_API_TOKEN defined');

      throw new InternalServerErrorException('No EMAIL_API_TOKEN defined');
    }

    const payload = {
      from: {
        email: 'no-reply@mikashboks.com',
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
    workflowRuntimeDataId,
    vendor,
    withAml,
    ongoingMonitoring,
    language,
    revisionReason,
    projectId,
    // Bio-facial fields — forwarded to Unified API when an upstream workflow
    // provides document images and selfies in the context.
    documents,
    biometricData,
    idNumber,
    phoneNumber,
    country,
    methods,
    performDeduplication,
    requireLivenessForEnrollment,
    facialDeduplication,
  }: {
    endUserId: string;
    workflowRuntimeDataId: string;
    vendor: 'veriff';
    withAml?: boolean;
    ongoingMonitoring?: boolean;
    language: string;
    revisionReason: string | undefined;
    projectId: TProjectId;
    documents?: Array<{
      type?: string;
      frontImage?: string;
      backImage?: string;
      documentNumber?: string;
    }>;
    biometricData?: { facialImages?: string[] };
    idNumber?: string;
    phoneNumber?: string;
    country?: string;
    methods?: string[];
    performDeduplication?: boolean;
    requireLivenessForEnrollment?: boolean;
    facialDeduplication?: {
      enabled?: boolean;
      threshold?: number;
      maxResults?: number;
    };
  }) {
    const APP_API_URL = this.configService.get('APP_API_URL');

    if (!APP_API_URL) {
      throw new InternalServerErrorException('APP_API_URL is not defined');
    }

    const endUser = await this.endUserService.getById(
      endUserId,
      {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          dateOfBirth: true,
          additionalInfo: true,
        },
      },
      [projectId],
    );

    if (!endUser.email) {
      throw new BadRequestException('End-user email is required');
    }

    if (!isType(z.object({ additionalInfo: z.object({ companyName: z.string() }) }))(endUser)) {
      throw new BadRequestException('End-user company name is required');
    }

    const customer = await this.customerService.getByProjectId(projectId, {
      select: {
        id: true,
        name: true,
        displayName: true,
      },
    });

    const unifiedApiVerificationHookId = this.configService.get<string>(
      'UNIFIED_API_VERIFICATION_HOOK_ID',
    );

    if (!unifiedApiVerificationHookId) {
      throw new InternalServerErrorException('UNIFIED_API_VERIFICATION_HOOK_ID is not defined');
    }

    const callbackQuery = new URLSearchParams({
      resultDestination: 'pluginsOutput.kyc_session.kyc_session_1.result',
      processName: 'kyc-unified-api',
    });
    const callbackUrl =
      `${APP_API_URL}/api/v1/external/workflows/${workflowRuntimeDataId}/hook/` +
      `${encodeURIComponent(unifiedApiVerificationHookId)}?${callbackQuery.toString()}`;
    const {
      id: sessionId,
      url: kycLink,
      checkId,
    } = await this.initiateIndividualVerification({
      endUserId: endUser.id,
      workflowRuntimeDataId,
      // TODO: Get from KYC check table
      sessionId: undefined,
      clientId: customer.name,
      vendor,
      withAml: withAml ?? true,
      ongoingMonitoring: ongoingMonitoring ?? false,
      callbackUrl,
      firstName: endUser.firstName,
      lastName: endUser.lastName,
      dateOfBirth: endUser.dateOfBirth?.toISOString().split('T')[0] ?? undefined,
      projectId,
      customerId: customer.id,
      // Bio-facial fields — forwarded only when provided by the caller
      documents,
      biometricData,
      idNumber,
      phoneNumber,
      country,
      methods,
      performDeduplication,
      requireLivenessForEnrollment,
      facialDeduplication,
    });

    await this.sendIndividualVerificationEmail({
      firstName: endUser.firstName,
      kycLink,
      email: endUser.email,
      customerName: customer.displayName,
      language,
      companyName: endUser.additionalInfo?.companyName,
      revisionReason,
    });

    return {
      checkId,
      sessionId,
      url: kycLink,
    };
  }

  async initiateAml({
    endUserId,
    clientId,
    vendor,
    ongoingMonitoring,
    immediateResults,
    callbackUrl,
    firstName,
    lastName,
    dateOfBirth,
    projectId,
    customerId,
  }: {
    endUserId: string;
    clientId: string;
    vendor: 'veriff';
    ongoingMonitoring: boolean;
    immediateResults: boolean;
    callbackUrl: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    projectId?: string;
    customerId?: string;
  }) {
    return await this.unifiedApiClient.runAml({
      endUserId,
      clientId,
      vendor,
      ongoingMonitoring,
      immediateResults,
      callbackUrl,
      firstName,
      lastName,
      dateOfBirth,
      projectId,
      customerId,
    });
  }
}
