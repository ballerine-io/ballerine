import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import axios, { Method, RawAxiosRequestHeaders } from 'axios';
import { AnyRecord, isErrorWithMessage, sign } from '@ballerine/common';

@Injectable()
export class OutgoingWebhooksService {
  constructor(private readonly logger: AppLoggerService) {}

  async invokeWebhook({
    url,
    method,
    headers: argsHeaders,
    body,
    timeout,
    secret,
  }: {
    url: string;
    method: Method;
    headers?: Partial<RawAxiosRequestHeaders>;
    body?: AnyRecord | string;
    timeout?: number;
    secret?: string;
  }) {
    const headers: RawAxiosRequestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...argsHeaders,
    };

    if (body && secret) {
      headers['X-HMAC-Signature'] = sign({ payload: body, key: secret });
    }

    return await axios({
      url,
      method,
      headers,
      data: body,
      timeout: timeout ?? 15000,
    });
  }
}
