import { AnyRecord } from '@ballerine/common';
import { logger } from '../../logger';
import { IApiPluginParams } from './types';
import { ApiPlugin } from './api-plugin';
import { ApiEmailTemplates } from './vendor-consts';
import { BallerineApiPlugin, IBallerineApiPluginParams } from './ballerine-api-plugin';

export interface IBallerineEmailPluginParams {
  pluginKind: 'template-email';
  template: ApiEmailTemplates;
  displayName: string | undefined;
  stateNames: string[];
}

export class BallerineEmailPlugin extends BallerineApiPlugin {
  public static pluginType = 'http';

  constructor(params: IBallerineEmailPluginParams & IBallerineApiPluginParams & IApiPluginParams) {
    super(params);
  }

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ) {
    const _payload = await this._onPreparePayload(payload);

    const from = {
      from: { email: _payload.from, ...(_payload.name ? { name: _payload.name } : {}) },
    };

    const subject = _payload.subject ?? {};

    const preheader = _payload.preheader ?? {};

    const receivers = (_payload.receivers as string[]).map(receiver => {
      return { email: receiver };
    });

    const to = { to: receivers };

    const templateId = { template_id: _payload.templateId };

    const emailPayload = {
      ...from,
      personalizations: [
        {
          ...preheader,
          ...subject,
          ...to,
          ...{ dynamic_template_data: _payload },
        },
      ],
      ...templateId,
    };

    _payload.adapter ??= 'sendgrid';

    if (_payload.adapter === 'log') {
      logger.warn('No email provider', { emailPayload });

      return {
        ok: true,
        json: () => Promise.resolve({}),
        statusText: 'OK',
        headers: {} as Headers,
      };
    }

    return await super.makeApiRequest(url, method, emailPayload, headers);
  }

  returnSuccessResponse(callbackAction: string, responseBody: AnyRecord) {
    return super.returnSuccessResponse(callbackAction, {});
  }
}
