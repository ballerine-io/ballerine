import { TContext, Transformer, Transformers, Validator } from '../../utils';
import { AnyRecord, isErrorWithMessage, isObject } from '@ballerine/common';
import { IApiPluginParams } from './types';
import { logger } from '../../logger';

export class ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'api';
  name: string;
  stateNames: string[];
  url: string;
  method: IApiPluginParams['method'];
  headers: IApiPluginParams['headers'];
  request: IApiPluginParams['request'];
  response?: IApiPluginParams['response'];
  successAction?: string;
  errorAction?: string;
  persistResponseDestination?: string;
  displayName: string | undefined;
  secretsManager: IApiPluginParams['secretsManager'];
  memoizedSecrets: Record<string, string> | undefined;

  constructor(pluginParams: IApiPluginParams) {
    this.name = pluginParams.name;
    this.stateNames = pluginParams.stateNames;
    this.url = pluginParams.url;
    this.method = pluginParams.method;
    this.headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      ...(pluginParams.headers || {}),
    } as HeadersInit;
    this.request = pluginParams.request;
    this.response = pluginParams.response;
    this.successAction = pluginParams.successAction;
    this.errorAction = pluginParams.errorAction;
    this.persistResponseDestination = pluginParams.persistResponseDestination;
    this.secretsManager = pluginParams.secretsManager;

    this.displayName = pluginParams.displayName;
  }

  async invoke(context: TContext) {
    try {
      const requestPayload = await this.transformData(this.request.transformers, context);

      const { isValidRequest, errorMessage } = await this.validateContent(
        this.request.schemaValidator,
        requestPayload,
        'Request',
      );

      if (!isValidRequest) {
        return this.returnErrorResponse(errorMessage!);
      }

      const urlWithoutPlaceholders = await this.replaceValuePlaceholders(this.url, context);

      logger.log('API Plugin - Sending API request', {
        url: urlWithoutPlaceholders,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(
        urlWithoutPlaceholders,
        this.method,
        requestPayload,
        await this.composeRequestHeaders(this.headers!, context),
      );

      logger.log('API Plugin - Received response', {
        status: apiResponse.statusText,
        url: urlWithoutPlaceholders,
      });

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        let responseBody = result as AnyRecord;

        if (this.response?.transformers) {
          responseBody = await this.transformData(this.response.transformers, result as AnyRecord);
        }

        const { isValidResponse, errorMessage } = await this.validateContent(
          this.response!.schemaValidator,
          responseBody,
          'Response',
        );

        if (!isValidResponse) {
          return this.returnErrorResponse(errorMessage!);
        }

        if (this.successAction) {
          return this.returnSuccessResponse(this.successAction, {
            ...responseBody,
          });
        }

        return {};
      } else {
        const errorResponse = await apiResponse.json();

        return this.returnErrorResponse(
          'Request Failed: ' + apiResponse.statusText + ' Error: ' + JSON.stringify(errorResponse),
        );
      }
    } catch (error) {
      return this.returnErrorResponse(isErrorWithMessage(error) ? error.message : '');
    }
  }

  returnSuccessResponse(callbackAction: string, responseBody: AnyRecord) {
    return { callbackAction, responseBody };
  }

  returnErrorResponse(errorMessage: string) {
    return { callbackAction: this.errorAction, error: errorMessage };
  }

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ): Promise<{
    ok: boolean;
    json: () => Promise<unknown>;
    statusText: string;
  }> {
    const requestParams = {
      method: method,
      headers: headers,
    };

    for (const key of Object.keys(payload)) {
      if (typeof payload[key] === 'string') {
        payload[key] = await this.replaceValuePlaceholders(payload[key] as string, payload);
      }
    }

    // @TODO: Use an enum over string literals for HTTP methods
    if (this.method.toUpperCase() !== 'GET' && payload) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      requestParams.body = JSON.stringify(payload);
    } else if (this.method.toUpperCase() === 'GET' && payload) {
      const queryParams = new URLSearchParams(payload as Record<string, string>).toString();
      url = `${url}?${queryParams}`;
    }

    const res = await fetch(url, requestParams);

    if ([204, 202].includes(res.status)) {
      return {
        ok: true,
        json: () => Promise.resolve({ statusCode: res.status }),
        statusText: 'OK',
      };
    }

    return res;
  }

  async transformData(transformers: Transformers, record: AnyRecord) {
    let mutatedRecord = record;

    if (!transformers) {
      throw new Error('No transformers were provided');
    }

    for (const transformer of transformers) {
      mutatedRecord = await this.transformByTransformer(transformer, mutatedRecord);
    }

    return mutatedRecord;
  }

  async transformByTransformer(transformer: Transformer, record: AnyRecord) {
    try {
      return (await transformer.transform(record, { input: 'json', output: 'json' })) as AnyRecord;
    } catch (error) {
      throw new Error(
        `Error transforming data: ${
          isErrorWithMessage(error) ? error.message : ''
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        } for transformer mapping: ${JSON.stringify(transformer.mapping)}`,
      );
    }
  }

  async validateContent<TValidationContext extends 'Request' | 'Response'>(
    schemaValidator: Validator | undefined,
    transformedRequest: AnyRecord,
    validationContext: TValidationContext,
  ) {
    const returnArgKey = `isValid${validationContext}`;

    if (!schemaValidator) return { [returnArgKey]: true };

    const { isValid, errorMessage } = await schemaValidator.validate(transformedRequest);

    return { [returnArgKey]: isValid, errorMessage };
  }

  async composeRequestHeaders(headers: HeadersInit, context: TContext) {
    const headersEntries = await Promise.all(
      Object.entries(headers).map(async header => [
        header[0],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.replaceValuePlaceholders(header[1], context),
      ]),
    );

    return Object.fromEntries(headersEntries);
  }

  async replaceValuePlaceholders(content: string, context: TContext) {
    const placeholders = content.match(/{(.*?)}/g);

    if (!placeholders) return content;

    let replacedContent = content;

    for (const placeholder of placeholders) {
      const variableKey = placeholder.replace(/{|}/g, '');

      const isSystemSecret = variableKey.includes('secret.');
      const isSecret = variableKey.includes('secrets.');

      if (isSystemSecret) {
        const secretKey = variableKey.replace('secret.', '');
        const secretValue = `${this.getSystemSecret(secretKey)}`;

        replacedContent = replacedContent.replace(placeholder, secretValue);
      } else if (isSecret) {
        const secretKey = variableKey.replace('secrets.', '');
        const secretValue = `${await this.fetchSecret(secretKey)}`;

        replacedContent = replacedContent.replace(placeholder, secretValue);
      } else {
        const placeholderValue = `${this.fetchObjectPlaceholderValue(context, variableKey)}`;

        replacedContent = replacedContent.replace(placeholder, placeholderValue);
      }
    }

    return replacedContent;
  }

  getSystemSecret(key: string) {
    return process.env[key] || '';
  }

  async fetchSecret(key: string) {
    if (!this.secretsManager) {
      throw new Error('No secret manager found.');
    }

    if (!this.memoizedSecrets) {
      this.memoizedSecrets = await this.secretsManager.getAll();
    }

    return this.memoizedSecrets[key] || '';
  }

  fetchObjectPlaceholderValue(record: AnyRecord, path: string) {
    const pathToValue = path.split('.');

    return pathToValue.reduce((acc: unknown, pathKey: string) => {
      // eslint-disable-next-line no-prototype-builtins
      if (isObject(acc)) {
        return (acc as AnyRecord)[pathKey];
      } else {
        return undefined;
      }
    }, record as unknown);
  }
}
