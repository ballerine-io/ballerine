import { TContext, TTransformers, TValidators } from '../../utils/types';
import { AnyRecord, isErrorWithMessage } from '@ballerine/common';
import * as process from "process";

export interface IApiPluginParams {
  name: string;
  stateNames: Array<string>;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  request: { transformer: TTransformers; schemaValidator?: TValidators };
  response?: { transformer: TTransformers; schemaValidator?: TValidators };
  headers?: HeadersInit;
  successAction?: string;
  errorAction?: string;
}
export class ApiPlugin {
  name: string;
  stateNames: Array<string>;
  url: string;
  method: IApiPluginParams['method'];
  headers: IApiPluginParams['headers'];
  request: IApiPluginParams['request'];
  response?: IApiPluginParams['response'];
  successAction?: string;
  errorAction?: string;

  constructor(pluginParams: IApiPluginParams) {
    this.name = pluginParams.name;
    this.stateNames = pluginParams.stateNames;
    this.url = pluginParams.url;
    this.method = pluginParams.method;
    this.headers = {'Content-Type': 'application/json', ...(pluginParams.headers || {})} as HeadersInit;
    this.request = pluginParams.request;
    this.response = pluginParams.response;
    this.successAction = pluginParams.successAction;
    this.errorAction = pluginParams.errorAction;
  }
  async callApi(context: TContext) {
    try {
      const requestPayload = await this.transformData(this.request.transformer, context);
      const { isValidRequest, errorMessage } = await this.validateContent(
        this.request.schemaValidator,
        requestPayload,
        'Request',
      );
      if (!isValidRequest) return this.returnErrorResponse(errorMessage!);

      const apiResponse = await this.makeApiRequest(
        this.replaceValuePlaceholders(this.url, context),
        this.method,
        requestPayload,
        this.composeRequestHeaders(this.headers!, context)
      );

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        const responseBody = await this.transformData(
          this.response!.transformer,
          result as AnyRecord,
        );

        const { isValidResponse, errorMessage } = await this.validateContent(
          this.response!.schemaValidator,
          responseBody,
          'Response',
        );
        if (!isValidResponse) return this.returnErrorResponse(errorMessage!);

        return { callbackAction: this.successAction, responseBody };
      } else {
        return this.returnErrorResponse('Request Failed: ' + apiResponse.statusText);
      }
    } catch (error) {
      return this.returnErrorResponse(isErrorWithMessage(error) ? error.message : '');
    }
  }
  returnErrorResponse(errorMessage: string) {
    return { callbackAction: this.errorAction, error: errorMessage };
  }

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ) {
    const requestParams = {
      method: method,
      headers: headers,
    };

    if (this.method.toUpperCase() === 'POST') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      requestParams.body = JSON.stringify(payload);
    } else if (this.method.toUpperCase() === 'GET' && payload) {
      const queryParams = new URLSearchParams(payload as Record<string, string>).toString();
      url = `${url}?${queryParams}`;
    }

    return await fetch(url, requestParams);
  }

  async transformData(transformer: TTransformers, record: AnyRecord) {
    try {
      return (await transformer.transform(record, { input: 'json', output: 'json' })) as AnyRecord;
    } catch (error) {
      throw new Error(
        `Error transforming data: ${
          isErrorWithMessage(error) ? error.message : ''
        } for transformer mapping: ${transformer.mapping}`,
      );
    }
  }

  async validateContent<TValidationContext extends 'Request' | 'Response'>(
    schemaValidator: TValidators | undefined,
    transformedRequest: AnyRecord,
    validationContext: TValidationContext,
  ) {
    const returnArgKey = `isValid${validationContext}`;
    if (!schemaValidator) return { [returnArgKey]: true };

    const { isValid, errorMessage } = await schemaValidator.validate(transformedRequest);
    return { [returnArgKey]: isValid, errorMessage };
  }

  composeRequestHeaders(headers: HeadersInit, context: TContext) {
    return Object.fromEntries(Object.entries(headers).map(header => [header[0], this.replaceValuePlaceholders(header[1], context)]));
  }
  replaceValuePlaceholders(content: string, context: TContext) {
    const placeholders = content.match(/{(.*?)}/g);
    if (!placeholders) return content;

    let replacedContent = content;
    placeholders.forEach(placeholder => {
      const variableKey = placeholder.replace(/{|}/g, '');
      const isPlaceholderSecret = variableKey.includes('secret.');
      const placeholderValue = isPlaceholderSecret ?
        `${process.env[variableKey.replace('secret.','')]}`:
        `${this.fetchObjectPlaceholderValue(context, variableKey)}`;
      replacedContent = replacedContent.replace(placeholder, placeholderValue);
    });

    return replacedContent;
  }

  fetchObjectPlaceholderValue(record: AnyRecord, path: string) {
    let pathToValue = path.split('.');

    return pathToValue.reduce((acc: unknown, pathKey: string) => {
      if (typeof acc === 'object' && acc !== null && acc.hasOwnProperty(pathKey)) {
        return (acc as AnyRecord)[pathKey];
      } else {
        return undefined;
      }
    }, record as unknown);
  }
}



