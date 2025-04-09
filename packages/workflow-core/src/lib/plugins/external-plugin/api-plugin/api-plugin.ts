import { AnyRecord, isErrorWithMessage, isObject } from '@ballerine/common';
import { logger } from '../../../logger';
import {
  HelpersTransformer,
  TContext,
  THelperFormatingLogic,
  Transformer,
  Transformers,
  Validator,
} from '../../../utils';
import { IApiPluginParams } from '../types';

export const invokedAtTransformerDefinition = {
  source: 'invokedAt',
  target: 'invokedAt',
  method: 'setTimeToRecordUTC',
};

export const invokedAtTransformer: HelpersTransformer = new HelpersTransformer([
  invokedAtTransformerDefinition,
] as THelperFormatingLogic);

export class ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'api';
  name: string;
  stateNames: string[];
  url: IApiPluginParams['url'];
  method: IApiPluginParams['method'];
  vendor?: IApiPluginParams['vendor'];
  headers: IApiPluginParams['headers'];
  request: IApiPluginParams['request'];
  response?: IApiPluginParams['response'];
  successAction?: string;
  errorAction?: string;
  persistResponseDestination?: string;
  displayName: string | undefined;
  secretsManager: IApiPluginParams['secretsManager'];
  memoizedSecrets: Record<string, string> | undefined;
  whitelistedInputProperties: string[] | undefined;
  includeInvokedAt: boolean;

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
    this.whitelistedInputProperties = pluginParams.whitelistedInputProperties;
    this.includeInvokedAt = pluginParams.includeInvokedAt ?? true;
  }

  async invoke(context: TContext, additionalContext?: AnyRecord) {
    let requestPayload;
    let outputRequestPayload;

    try {
      if (this.request && 'transformers' in this.request) {
        requestPayload = await this.transformData(this.request.transformers, context);
        outputRequestPayload = this.generateRequestPayloadFromWhitelist(requestPayload);

        const { isValidRequest, errorMessage } = await this.validateContent(
          this.request.schemaValidator,
          requestPayload,
          'Request',
        );

        if (!isValidRequest) {
          return this.returnErrorResponse(errorMessage!, outputRequestPayload);
        }
      }

      const _url = await this._getPluginUrl({
        ...context,
        ...additionalContext,
      });

      logger.log('API Plugin - Sending API request', {
        url: _url,
        method: this.method,
      });

      const apiResponse = await this.makeApiRequest(
        _url,
        this.method,
        requestPayload,
        await this.composeRequestHeaders(this.headers!, {
          ...context,
          ...additionalContext,
        }),
      );

      logger.log('API Plugin - Received response', {
        status: apiResponse.statusText,
        url: _url,
      });

      if (apiResponse.ok) {
        const result = await apiResponse.json();

        const responseTransformers = this.includeInvokedAt
          ? [...(this.response?.transformers || []), invokedAtTransformer]
          : this.response?.transformers || [];

        const responseBody = await this.transformData(responseTransformers, result as AnyRecord);

        const { isValidResponse, errorMessage } = await this.validateContent(
          this.response!.schemaValidator,
          responseBody,
          'Response',
        );

        if (!isValidResponse) {
          return this.returnErrorResponse(errorMessage!, outputRequestPayload);
        }

        if (this.successAction) {
          return this.returnSuccessResponse(
            this.successAction,
            {
              ...responseBody,
            },
            outputRequestPayload,
          );
        }

        return {};
      } else {
        const errorResponse = await apiResponse.json();

        return this.returnErrorResponse(
          'Request Failed: ' + apiResponse.statusText + ' Error: ' + JSON.stringify(errorResponse),
          outputRequestPayload,
        );
      }
    } catch (error) {
      logger.error('API Plugin - Error', {
        error: error,
        outputRequestPayload: outputRequestPayload,
      });

      return this.returnErrorResponse(
        isErrorWithMessage(error) ? error.message : '',
        outputRequestPayload,
      );
    }
  }

  protected async _getPluginUrl(context: AnyRecord) {
    let _url: string;

    if (typeof this.url === 'string') {
      _url = this.url;
    } else {
      // expected url to be an object { url: string, options: Record<string, string> }

      if (this.url.url) {
        _url = this.url.url;
      } else {
        throw new Error('URL is required');
      }

      const { options } = this.url;

      if (options !== null && typeof options === 'object' && !Array.isArray(options)) {
        _url = await this.replaceVariablesFromContext(this.url.url, this.url.options);
      } else {
        // if options is not an object
        throw new Error('Url options should be an object');
      }
    }

    return await this.replaceAllVariables(_url, context);
  }

  returnSuccessResponse(
    callbackAction: string,
    responseBody: AnyRecord,
    requestPayload?: AnyRecord,
  ) {
    return { callbackAction, responseBody, requestPayload };
  }

  returnErrorResponse(errorMessage: string, requestPayload?: AnyRecord) {
    return { callbackAction: this.errorAction, error: errorMessage, requestPayload };
  }

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord | undefined,
    headers: HeadersInit,
  ): Promise<{
    ok: boolean;
    json: () => Promise<unknown>;
    statusText: string;
    headers: Headers;
  }> {
    let _url: string = url;

    const _requestParams = {
      method: method,
      headers: headers,
      body: undefined,
      credentials: 'include',
    } satisfies RequestInit;

    if (payload) {
      payload = await this._onPreparePayload(payload);

      // @TODO: Use an enum over string literals for HTTP methods
      if (method.toUpperCase() !== 'GET') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _requestParams.body = JSON.stringify(payload);
      } else if (method.toUpperCase() === 'GET') {
        const queryParams = new URLSearchParams(payload as Record<string, string>).toString();
        _url = `${_url}?${queryParams}`;
      }
    }

    const res = await fetch(_url, _requestParams);

    if ([204, 202].includes(res.status)) {
      return {
        ok: true,
        json: () => Promise.resolve({ statusCode: res.status }),
        statusText: 'OK',
        headers: res.headers,
      };
    }

    return res;
  }

  protected async _onPreparePayload(_payload: AnyRecord) {
    const returnObj = JSON.parse(JSON.stringify(_payload));

    for (const key of Object.keys(returnObj)) {
      if (typeof returnObj[key] === 'string') {
        returnObj[key] = await this.replaceAllVariables(returnObj[key] as string, returnObj);
      }
    }

    return returnObj;
  }

  async transformData(transformers: Transformers | undefined, record: AnyRecord) {
    let mutatedRecord = record;

    if (!transformers) {
      throw new Error('No transformers were provided');
    }

    for (const transformer of transformers) {
      const transformed = await this.transformByTransformer(transformer, mutatedRecord);
      mutatedRecord = Object.fromEntries(
        Object.entries(transformed).filter(([_, value]) => value !== null && value !== undefined),
      );
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

    if (!schemaValidator) {
      return { [returnArgKey]: true };
    }

    const { isValid, errorMessage } = await schemaValidator.validate(transformedRequest);

    return { [returnArgKey]: isValid, errorMessage };
  }

  async composeRequestHeaders(headers: HeadersInit, context: TContext) {
    const headersEntries = await Promise.all(
      Object.entries(headers).map(async header => [
        header[0],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.replaceAllVariables(header[1], context),
      ]),
    );

    return Object.fromEntries(headersEntries);
  }

  async _onReplaceVariable(variableKey: string, replacedContent: string, placeholder: string) {
    let replacedSecrets = await this.replaceCustomerVariable(
      variableKey,
      replacedContent,
      placeholder,
    );

    // // TODO: Remove this line when migrate to new ballerine plugins
    replacedSecrets = await this.replaceBallerineVariable(
      variableKey,
      replacedContent,
      placeholder,
    );

    return replacedSecrets;
  }

  async replaceBallerineVariable(variableKey: string, content: string, placeholder: string) {
    return await this.replaceSecretsByProvider('ballerine', variableKey, content, placeholder);
  }

  async replaceCustomerVariable(variableKey: string, content: string, placeholder: string) {
    return await this.replaceSecretsByProvider('customer', variableKey, content, placeholder);
  }

  async replaceAllVariables(content: string, context: TContext) {
    const replacedContent = await this.replaceSecrets(content);

    return this.replaceVariablesFromContext(replacedContent, context);
  }

  async replaceSecrets(content: string) {
    const placeholders = content.match(/{(.*?)}/g);

    if (!placeholders) {
      return content;
    }

    let replacedContent = content;

    for (const placeholder of placeholders) {
      const variableKey = placeholder.replace(/{|}/g, '');

      replacedContent = await this._onReplaceVariable(variableKey, replacedContent, placeholder);
    }

    return replacedContent;
  }

  async replaceVariablesFromContext(content: string, context: TContext) {
    const placeholders = content.match(/{(.*?)}/g);

    if (!placeholders) {
      return content;
    }

    let replacedContent = content;

    for (const placeholder of placeholders) {
      const variableKey = placeholder.replace(/{|}/g, '');

      if (variableKey.startsWith('secret')) {
        continue;
      }

      const placeholderValue = this.fetchObjectPlaceholderValue(context, variableKey);

      if (placeholderValue === undefined) {
        continue;
      }

      replacedContent = replacedContent.replace(placeholder, `${placeholderValue}`);
    }

    return replacedContent;
  }

  async replaceSecretsByProvider(
    provider: 'ballerine' | 'customer',
    variableKey: string,
    content: string,
    placeholder: string,
  ) {
    const variableName = provider === 'ballerine' ? 'secret.' : 'secrets.';

    let replacedContent = content;

    if (provider === 'ballerine' && variableKey.includes(variableName)) {
      const secretKey = variableKey.replace(variableName, '');
      const secretValue = `${this.getSystemSecret(secretKey)}`;

      replacedContent = content.replace(placeholder, secretValue);
    } else if (provider === 'customer' && variableKey.includes(variableName)) {
      const secretKey = variableKey.replace('secrets.', '');
      const secretValue = `${await this.fetchSecret(secretKey)}`;

      replacedContent = content.replace(placeholder, secretValue);
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

  generateRequestPayloadFromWhitelist(payload: AnyRecord = {}) {
    if (!this.whitelistedInputProperties) {
      return payload;
    }

    const whitelistedPayload: AnyRecord = {};

    for (const key of this.whitelistedInputProperties) {
      const value = payload[key];
      whitelistedPayload[key] = value;

      if (value) {
        continue;
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        whitelistedPayload[key] = this.generateRequestPayloadFromWhitelist(value as AnyRecord);
      }
    }

    return whitelistedPayload;
  }
}
