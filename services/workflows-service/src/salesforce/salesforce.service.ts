import { Injectable } from '@nestjs/common';
import { env } from '@/env';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import axios from 'axios';
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
