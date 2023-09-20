import { Injectable } from '@nestjs/common';
import { env } from '@/env';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import axios, { isAxiosError } from 'axios';
import { GetAccessTokenSchema, GetUserInfoSchema } from '@/salesforce/salesforce.schema';
import {
  AUTHORIZE_URL,
  GET_ACCESS_TOKEN_URL,
  REDIRECT_URL,
} from '@/salesforce/salesforce.constants';

@Injectable()
export class SalesforceService {
  constructor(public readonly salesforceIntegrationRepository: SalesforceIntegrationRepository) {}

  public async findByProjectId(projectId: string) {
    return await this.salesforceIntegrationRepository.findByProjectId(projectId);
  }

  public getAuthorizationUrl() {
    const scopes = ['id', 'api', 'refresh_token'];

    const url = new URL(AUTHORIZE_URL);

    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', env.SALESFORCE_CONSUMER_KEY!);
    url.searchParams.append('redirect_uri', `${env.APP_API_URL}/api/v1/salesforce/callback`);
    url.searchParams.append('scope', scopes.join(' '));

    return url.toString();
  }

  public async authorize(projectId: string, { code }: { code: string }) {
    const { accessToken, refreshToken, instanceUrl, idUrl, issuedAt } = await this.getAccessToken(
      code,
    );
    const { userId, organizationId } = await this.getUserInfo(accessToken, idUrl);

    return await this.salesforceIntegrationRepository.create(projectId, {
      userId,
      organizationId,
      instanceUrl,
      accessToken,
      accessTokenIssuedAt: new Date(issuedAt),
      refreshToken,
      idUrl,
    });
  }

  public async refreshAccessToken(refreshToken: string) {
    const response = await axios.post<unknown>(GET_ACCESS_TOKEN_URL, null, {
      params: {
        grant_type: 'refresh_token',
        client_id: env.SALESFORCE_CONSUMER_KEY,
        client_secret: env.SALESFORCE_CONSUMER_SECRET,
        refresh_token: refreshToken,
      },
    });

    return GetAccessTokenSchema.parse(response.data);
  }

  public async updateRecord({
    projectId,
    objectName,
    recordId,
    data,
    refreshAccessToken = true,
  }: {
    projectId: string;
    objectName: string;
    recordId: string;
    data: Record<string, unknown>;
    refreshAccessToken?: boolean;
  }): Promise<void> {
    const salesforceIntegration = await this.findByProjectId(projectId);

    if (!salesforceIntegration) {
      throw new Error('Salesforce integration not found');
    }

    const updateEndpoint = `${salesforceIntegration.instanceUrl}/services/data/v${env.SALESFORCE_API_VERSION}/sobjects/${objectName}/${recordId}`;

    try {
      await axios.patch(updateEndpoint, data, {
        headers: {
          Authorization: `Bearer ${salesforceIntegration.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401 && refreshAccessToken) {
        const { accessToken, issuedAt } = await this.refreshAccessToken(
          salesforceIntegration.refreshToken,
        );

        await this.salesforceIntegrationRepository.updateAccessToken(projectId, {
          accessToken,
          accessTokenIssuedAt: new Date(issuedAt),
        });

        return this.updateRecord({
          projectId,
          objectName,
          recordId,
          data,
          refreshAccessToken: false, // prevent infinite loop
        });
      }

      throw new Error(`Failed to update record in Salesforce`, { cause: error });
    }
  }

  private async getAccessToken(code: string) {
    const response = await axios.post<unknown>(GET_ACCESS_TOKEN_URL, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: env.SALESFORCE_CONSUMER_KEY,
        client_secret: env.SALESFORCE_CONSUMER_SECRET,
        redirect_uri: REDIRECT_URL,
        code: code,
      },
    });

    return GetAccessTokenSchema.parse(response.data);
  }

  private async getUserInfo(accessToken: string, idUrl: string) {
    const response = await axios.get<unknown>(idUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      params: {
        version: env.SALESFORCE_API_VERSION,
      },
    });

    return GetUserInfoSchema.parse(response.data);
  }
}
