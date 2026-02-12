import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from '@/env';
import {
  Logger,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Business, Customer } from '@prisma/client';
import { TSchema } from '@sinclair/typebox';
import { FEATURE_LIST, TCustomerWithFeatures } from '@/customer/types';
import { TCustomerConfig } from '@/customer/schemas/zod-schemas';
import { UpdateableAssessmentStatus } from '@ballerine/common';
import { isType } from '@ballerine/common';
import z from 'zod';
import { getGcpIdToken } from '@/common/utils/gcp-id-token';

export type BusinessPayload = Pick<
  Business,
  'id' | 'correlationId' | 'companyName' | 'metadata' | 'createdAt' | 'updatedAt'
> & {
  project: { customer: { id: string; config: TCustomerConfig | null } };
};

export type TOcrImages = Array<
  | {
      remote: {
        imageUri: string;
        mimeType: string;
      };
    }
  | {
      base64: string;
    }
>;

export const axiosNoResponseErrorToHttpException = (code: AxiosError['code']) => {
  if (code === 'ECONNREFUSED') {
    return new ServiceUnavailableException('Service is currently unavailable');
  }

  if (code === 'ETIMEDOUT') {
    return new ServiceUnavailableException('Request timed out');
  }

  if (code === 'ENOTFOUND') {
    return new ServiceUnavailableException('Service not found');
  }

  return new ServiceUnavailableException('Network error occurred');
};

export const axiosErrorToHttpException = (error: AxiosError) => {
  if (!error.response) {
    return axiosNoResponseErrorToHttpException(error.code);
  }

  const checkIsResponseDataWithMessage = isType(
    z.object({
      response: z.object({
        data: z.object({
          message: z.string(),
        }),
      }),
    }),
  );
  const isResponseDataWithMessage = checkIsResponseDataWithMessage(error);
  const message = isResponseDataWithMessage ? error.response.data.message : error.message;
  const status = error.response.status;

  if (status === 400) {
    return new BadRequestException(message);
  }

  if (status === 401) {
    return new UnauthorizedException(message);
  }

  if (status === 403) {
    return new ForbiddenException(message);
  }

  if (status === 404) {
    return new NotFoundException(message);
  }

  if (status === 500) {
    return new InternalServerErrorException(message);
  }

  return new HttpException(message, status);
};

@Injectable()
export class UnifiedApiClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger(UnifiedApiClient.name);

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.UNIFIED_API_URL,
      headers: {
        Authorization: `Bearer ${env.UNIFIED_API_TOKEN as string}`,
        'x-api-key': env.UNIFIED_API_TOKEN as string,
      },
    });

    // In Cloud Run, Unified API is protected by IAM; attach an ID token per request.
    // Local/dev keeps using UNIFIED_API_TOKEN (app-level auth) without metadata calls.
    this.axiosInstance.interceptors.request.use(async config => {
      try {
        const audience = new URL(env.UNIFIED_API_URL).origin;
        const idToken = await getGcpIdToken(audience);

        if (idToken) {
          if (!config.headers) config.headers = {} as any;
          (config.headers as any).Authorization = `Bearer ${idToken}`;
        }
      } catch {
        // Best-effort; request will fail with 401/403 if IAM auth is required.
      }

      return config;
    });
  }

  /**
   * Build tenant/project isolation headers for Unified API requests.
   * These headers ensure downstream services (Document API, Bio-Facial, OpenSearch)
   * scope all data operations to the correct tenant and project.
   */
  private buildTenantHeaders(customerId?: string, projectId?: string): Record<string, string> {
    const headers: Record<string, string> = {};
    if (customerId) headers['x-tenant-id'] = customerId;
    if (projectId) headers['x-project-id'] = projectId;
    return headers;
  }

  async runOcr({
    images,
    schema,
    customerId,
    projectId,
  }: {
    images: TOcrImages;
    schema: TSchema;
    customerId?: string;
    projectId?: string;
  }) {
    return await this.axiosInstance.post(
      '/v1/smart-ocr',
      {
        images,
        schema,
      },
      {
        headers: this.buildTenantHeaders(customerId, projectId),
      },
    );
  }

  async runDocumentOcr({
    images,
    supportedCountries,
    overrideSchemas,
    customerId,
    projectId,
  }: {
    images: TOcrImages;
    supportedCountries: string[];
    overrideSchemas: {
      overrideSchemas: Array<{
        countryCode: string;
        documentType: string;
        documentCategory: string;
        schema: TSchema;
      }>;
    };
    customerId?: string;
    projectId?: string;
  }) {
    return await this.axiosInstance.post(
      '/v1/document/smart-ocr',
      {
        images,
        supportedCountries,
        overrideSchemas,
      },
      {
        headers: this.buildTenantHeaders(customerId, projectId),
      },
    );
  }

  public async createCustomer(payload: Customer) {
    return await this.axiosInstance.post('/customers', payload);
  }

  public async updateCustomer(id: string, payload: Customer) {
    return await this.axiosInstance.put(`/customers/${id}`, payload);
  }

  public async deleteCustomer(id: string) {
    return await this.axiosInstance.delete(`/customers/${id}`);
  }

  public async createOrUpdateBusiness(payload: BusinessPayload) {
    if (!this.shouldUpdateBusiness(payload)) {
      return;
    }

    const formattedPayload = this.formatBusiness(payload);

    return await this.axiosInstance.put(
      `/customers/${payload.project.customer.id}/businesses/${payload.id}`,
      formattedPayload,
      {
        headers: this.buildTenantHeaders(payload.project.customer.id),
      },
    );
  }

  public formatBusiness(business: BusinessPayload) {
    const metadata = business.metadata as unknown as {
      featureConfig: TCustomerWithFeatures['features'];
      lastOngoingReportInvokedAt: number;
    } | null;

    const unsubscribedMonitoringAt = metadata?.featureConfig?.[FEATURE_LIST.ONGOING_MERCHANT_REPORT]
      ?.disabledAt
      ? new Date(metadata.featureConfig[FEATURE_LIST.ONGOING_MERCHANT_REPORT]!.disabledAt!)
      : metadata?.featureConfig?.[FEATURE_LIST.ONGOING_MERCHANT_REPORT]?.enabled === false
      ? new Date()
      : null;

    return {
      id: business.id,
      correlationId: business.correlationId,
      companyName: business.companyName,
      customerId: business.project.customer.id,
      unsubscribedMonitoringAt: unsubscribedMonitoringAt?.toISOString() ?? null,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    };
  }

  public shouldUpdateBusiness(business: BusinessPayload) {
    return business.project.customer.config?.disableBusinessSyncToUnifiedApi !== true;
  }

  public async runEntityMatchingV2(payload: {
    entity1: string;
    entity2: string;
    includeAnalysis: boolean;
  }) {
    return await this.axiosInstance.post('/entity-matching-v2', {
      entity1: { value: payload.entity1 },
      entity2: { value: payload.entity2 },
      includeAnalysis: payload.includeAnalysis,
    });
  }

  public async getAssessmentsByType(
    assessmentType: 'kyb_and_ownership',
    projectId: string,
    queryParams: {
      page: number;
      limit: number;
    },
  ) {
    return await this.axiosInstance.get(`/assessments/${assessmentType}`, {
      params: {
        ...queryParams,
        projectId,
      },
    });
  }

  public async getAssessmentById(id: string, projectId: string) {
    return await this.axiosInstance.get(`/assessments/by-id/${id}?projectId=${projectId}`);
  }

  public async createAssessment(
    assessmentType: 'kyb_and_ownership',
    payload: {
      registrationNumber: string;
      companyName: string;
      country: string;
      projectId: string;
      businessId?: string;
    },
  ) {
    return await this.axiosInstance.post(`/assessments/${assessmentType}`, payload);
  }

  public async updateAssessmentStatus(
    id: string,
    status: UpdateableAssessmentStatus,
    projectId: string,
  ) {
    return await this.axiosInstance.put(`/assessments/${id}/status`, {
      status,
      projectId,
    });
  }

  public async getLatestAssessmentsByWorkflowRuntimeDataId({
    workflowRuntimeDataId,
    projectId,
  }: {
    workflowRuntimeDataId: string;
    projectId: string;
  }) {
    try {
      const response = await this.axiosInstance.get<Array<Record<string, any>>>(
        `/assessments/latest-by-workflow-runtime-data-id/${workflowRuntimeDataId}?projectId=${projectId}`,
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw axiosErrorToHttpException(error);
      }

      throw error;
    }
  }

  public async runIndividualVerification({
    clientId,
    endUserId,
    workflowRuntimeDataId,
    sessionId,
    vendor,
    withAml,
    ongoingMonitoring,
    callbackUrl,
    firstName,
    lastName,
    dateOfBirth,
    projectId,
    customerId,
    // Bio-facial fields — optional, enable facial verification when provided
    documents,
    biometricData,
    idNumber,
    phoneNumber,
    country,
    methods,
    performDeduplication,
  }: {
    clientId: string;
    endUserId: string;
    workflowRuntimeDataId: string;
    sessionId: string | undefined;
    vendor: 'veriff';
    withAml: boolean;
    ongoingMonitoring: boolean;
    callbackUrl: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    projectId: string;
    customerId?: string;
    documents?: Array<{
      type?: string;
      frontImage?: string;
      backImage?: string;
      documentNumber?: string;
    }>;
    biometricData?: {
      facialImages?: string[];
    };
    idNumber?: string;
    phoneNumber?: string;
    country?: string;
    methods?: string[];
    performDeduplication?: boolean;
  }) {
    return await this.axiosInstance.post(
      `/individual-verification-sessions`,
      {
        clientId,
        endUserId: `${endUserId}__${sessionId ?? ''}`,
        workflowRuntimeDataId,
        vendor,
        withAml,
        ongoingMonitoring,
        callbackUrl,
        firstName,
        lastName,
        dateOfBirth,
        projectId,
        // Bio-facial fields — omitted from payload when undefined
        ...(documents && { documents }),
        ...(biometricData && { biometricData }),
        ...(idNumber && { idNumber }),
        ...(phoneNumber && { phoneNumber }),
        ...(country && { country }),
        ...(methods && { methods }),
        ...(performDeduplication !== undefined && { performDeduplication }),
      },
      {
        headers: this.buildTenantHeaders(customerId, projectId),
      },
    );
  }

  public async runAml({
    clientId,
    endUserId,
    vendor,
    immediateResults,
    ongoingMonitoring,
    callbackUrl,
    firstName,
    lastName,
    dateOfBirth,
    projectId,
    customerId,
  }: {
    clientId: string;
    endUserId: string;
    vendor: 'veriff';
    immediateResults: boolean;
    ongoingMonitoring: boolean;
    callbackUrl: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    projectId?: string;
    customerId?: string;
  }) {
    return await this.axiosInstance.post(
      `/aml-sessions`,
      {
        clientId,
        endUserId,
        vendor,
        immediateResults,
        ongoingMonitoring,
        callbackUrl,
        firstName,
        lastName,
        dateOfBirth,
        projectId,
      },
      {
        headers: this.buildTenantHeaders(customerId, projectId),
      },
    );
  }
}
