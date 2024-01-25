import { TContext, Transformer, Transformers, Validator } from '../../utils';
import { AnyRecord, isErrorWithMessage, isObject } from '@ballerine/common';
import { IApiPluginParams } from './types';

export class ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'api';
  name: string;
  stateNames: Array<string>;
  url: string;
  method: IApiPluginParams['method'];
  headers: IApiPluginParams['headers'];
  request: IApiPluginParams['request'];
  response?: IApiPluginParams['response'];
  successAction?: string;
  errorAction?: string;
  persistResponseDestination?: string;
  displayName: string | undefined;
  isAsyncCallback: boolean;

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

    this.displayName = pluginParams.displayName;

    const checkIsAsyncCallback = (transformers: Transformers) => {
      const transformersMapping = transformers
        .filter(
          (
            transformer,
          ): transformer is Omit<typeof transformer, 'mapping'> & {
            mapping: string;
          } => typeof transformer?.mapping === 'string',
        )
        .flatMap(({ mapping }) => mapping)
        .join(' ');

      return transformersMapping.includes('callbackUrl:');
    };

    this.isAsyncCallback = checkIsAsyncCallback(this.request.transformers);
  }

  async invoke(context: TContext, config: unknown) {
    try {
      const requestPayload = await this.transformData(this.request.transformers, {
        ...context,
        workflowRuntimeConfig: config,
      });

      const { isValidRequest, errorMessage } = await this.validateContent(
        this.request.schemaValidator,
        requestPayload,
        'Request',
      );

      if (!isValidRequest) {
        return this.returnErrorResponse(errorMessage!);
      }

      const urlWithoutPlaceholders = this.replaceValuePlaceholders(this.url, context);

      console.log(`API Plugin :: Sending ${this.method} API request to ${urlWithoutPlaceholders}`);

      const apiResponse = await this.makeApiRequest(
        urlWithoutPlaceholders,
        this.method,
        requestPayload,
        this.composeRequestHeaders(this.headers!, context),
      );

      console.log(
        `API Plugin :: Received ${apiResponse.statusText} response from ${urlWithoutPlaceholders}`,
      );

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
          return this.returnSuccessResponse(this.successAction, responseBody);
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

    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = this.replaceValuePlaceholders(payload[key] as string, payload);
      }
    });

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

  composeRequestHeaders(headers: HeadersInit, context: TContext) {
    return Object.fromEntries(
      Object.entries(headers).map(header => [
        header[0],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.replaceValuePlaceholders(header[1], context),
      ]),
    );
  }

  replaceValuePlaceholders(content: string, context: TContext) {
    const placeholders = content.match(/{(.*?)}/g);
    if (!placeholders) return content;

    let replacedContent = content;
    placeholders.forEach(placeholder => {
      const variableKey = placeholder.replace(/{|}/g, '');
      const isPlaceholderSecret = variableKey.includes('secret.');
      const placeholderValue = isPlaceholderSecret
        ? `${process.env[variableKey.replace('secret.', '')]}`
        : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${this.fetchObjectPlaceholderValue(context, variableKey)}`;
      replacedContent = replacedContent.replace(placeholder, placeholderValue);
    });

    return replacedContent;
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
