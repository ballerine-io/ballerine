import {TContext, TTransformers, TValidators} from "../../utils/types";
import {AnyRecord} from "@ballerine/common";
class ApiPlugin {
  name: string;
  url: string;
  method:  'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  headers: HeadersInit;
  request: { transform: TTransformers, postTransformSchema?: TValidators };
  response: { transform: TTransformers, postTransformSchema?: TValidators };
  errorCallbackState: Function;
  successCallbackState: Function;

  constructor(
    name: string,
    url: string,
    method:  'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET',
    request: { transform: TTransformers, postTransformSchema?: TValidators },
    response: { transform: TTransformers, postTransformSchema?: TValidators },
    errorCallbackState: Function,
    successCallbackState: Function,
    headers?: HeadersInit,
  ) {
    this.name = name;
    this.url = url;
    this.method = method;
    this.headers = headers || {"Content-Type": "application/json"};
    this.request = request;
    this.response = response;
    this.errorCallbackState = errorCallbackState;
    this.successCallbackState = successCallbackState;
  }

  callApi = async (context: TContext) => {
    const payload = await this.transformRequest(context);
    await this.validateRequest(payload);

    const response = await fetch(this.url, {method: this.method, body: JSON.stringify(payload), headers: headers})

    if (response.ok) {
      const responseBody = await this.transformResponse(await response.json());
      await this.validateResponse(responseBody);

      this.successCallbackState(responseBody);
    } else {
      this.errorCallbackState(response.statusText)
    }
  }

  transformRequest = async (context: TContext) => {
    return await this.request.transform.transform(context, {}) as AnyRecord;
  }

  validateRequest = async (transformedRequest: AnyRecord) => {
    if (!this.request.postTransformSchema) return

    const {isValid, errorMessage} = await this.request.postTransformSchema.validate(transformedRequest);
    if (!isValid) {
      return this?.errorCallbackState(errorMessage);
    }
  }

  transformResponse = async (responseBody: AnyRecord) => {
    return await this.response.transform.transform(responseBody, {}) as AnyRecord;
  }

  validateResponse = async (transformedResponse: AnyRecord) => {
    if (!this.response.postTransformSchema) return

    const {isValid, errorMessage} = await this.response.postTransformSchema.validate(transformedResponse);
    if (!isValid) {
      return this?.errorCallbackState(errorMessage);
    }
  }
}
