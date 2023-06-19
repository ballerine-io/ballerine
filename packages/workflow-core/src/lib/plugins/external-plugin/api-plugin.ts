import { TContext, TTransformers, TValidators } from '../../utils/types';
import { AnyRecord } from '@ballerine/common';
import fetch from 'node-fetch';

export interface ApiPluginParams {
  name: string;
  stateNames: Array<string>;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  request: { transform: TTransformers; postTransformSchema?: TValidators };
  response: { transform: TTransformers; postTransformSchema?: TValidators };
  headers?: HeadersInit;
  successAction: string;
  errorAction: string;
}
export class ApiPlugin {
  name: string;
  stateNames: Array<string>;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  headers: HeadersInit;
  request: { transform: TTransformers; postTransformSchema?: TValidators };
  response: { transform: TTransformers; postTransformSchema?: TValidators };
  successAction: string;
  errorAction: string;

  constructor(pluginParams: ApiPluginParams) {
    this.name = pluginParams.name;
    this.stateNames = pluginParams.stateNames;
    this.url = pluginParams.url;
    this.method = pluginParams.method;
    this.headers = pluginParams.headers || { 'Content-Type': 'application/json' };
    this.request = pluginParams.request;
    this.response = pluginParams.response;
    this.successAction = pluginParams.successAction;
    this.errorAction = pluginParams.errorAction;
  }
  async callApi(context: TContext) {
    const payload = await this.transformRequest(context);
    await this.validateRequest(payload);

    const response = await this.makeApiRequest(this.url, this.method, payload, this.headers);

    if (response.ok) {
      const result = await response.json();
      const responseBody = await this.transformResponse(result as AnyRecord);
      await this.validateResponse(responseBody);

      return { callbackAction: this.successAction, response: responseBody };
    } else {
      return {
        callbackAction: this.errorAction,
        response: 'Request Failed: ' + response.statusText,
      };
    }
  }

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ) {
    let requestParams: {} = {
      method: method,
      headers: headers,
    };

    if (this.method.toUpperCase() === 'POST') {
      requestParams.body = JSON.stringify(payload);
    } else if (this.method.toUpperCase() === 'GET' && payload) {
      const queryParams = new URLSearchParams(payload).toString();
      url = `${this.url}?${queryParams}`;
    }

    return await fetch(url, requestParams);
  }

  async transformRequest(context: TContext) {
    return await this.request.transform.transform(context, { input: 'json', output: 'json' });
  }

  async validateRequest(transformedRequest: AnyRecord) {
    if (!this.request.postTransformSchema) return;

    const { isValid, errorMessage } = await this.request.postTransformSchema.validate(
      transformedRequest,
    );
    if (!isValid) {
      return this?.errorCallbackState(errorMessage);
    }
  }

  async transformResponse(responseBody: AnyRecord) {
    return (await this.response.transform.transform(responseBody, {})) as AnyRecord;
  }

  async validateResponse(transformedResponse: AnyRecord) {
    if (!this.response.postTransformSchema) return;

    const { isValid, errorMessage } = await this.response.postTransformSchema.validate(
      transformedResponse,
    );
    if (!isValid) {
      return this?.errorCallbackState(errorMessage);
    }
  }
}
