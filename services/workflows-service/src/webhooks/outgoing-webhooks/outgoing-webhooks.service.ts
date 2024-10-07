import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import axios, { Method } from 'axios';
import { AnyRecord, isErrorWithMessage, sign } from '@ballerine/common';

@Injectable()
export class OutgoingWebhooksService {
  constructor(private readonly logger: AppLoggerService) {}

  async invokeWebhook({
    requestConfig,
    customerConfig,
  }: {
    requestConfig: {
      url: string;
      method: Method;
      headers?: Record<string, string>;
      body?: AnyRecord | string;
      timeout?: number;
    };
    customerConfig?: {
      webhookSharedSecret?: string;
    };
  }) {
    const { url, method, headers, body, timeout } = requestConfig;

    const signedHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers,
      ...(body && customerConfig?.webhookSharedSecret
        ? {
            'X-HMAC-Signature': sign({
              payload: body,
              key: customerConfig.webhookSharedSecret,
            }),
          }
        : {}),
    };

    try {
      const response = await axios({
        url,
        method,
        headers: signedHeaders,
        data: body,
        timeout: timeout || 15000,
      });

      this.logger.log(`Webhook job completed with status: ${response.status}`);

      return response;
    } catch (error) {
      this.logger.error(`Webhook job failed: ${isErrorWithMessage(error) && error.message}`);
      throw error;
    }
  }
}
