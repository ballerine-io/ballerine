import { AnyRecord } from '@ballerine/common';
import { logger } from '../../logger';
import { IApiPluginParams } from './types';
import { ApiPlugin } from './api-plugin';
import { ApiEmailTemplates } from './vendor-consts';
import { BallerineApiPlugin, IBallerineApiPluginParams } from './ballerine-plugin';

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
    const from = { from: { email: payload.from, ...(payload.name ? { name: payload.name } : {}) } };
    const subject = payload.subject
      ? {
          subject: await (this as unknown as ApiPlugin).replaceAllVariables(
            payload.subject as string,
            payload,
          ),
        }
      : {};
    const preheader = payload.preheader
      ? {
          preheader: await (this as unknown as ApiPlugin).replaceAllVariables(
            payload.preheader as string,
            payload,
          ),
        }
      : {};
    const receivers = (payload.receivers as string[]).map(receiver => {
      return { email: receiver };
    });
    const to = { to: receivers };
    const templateId = { template_id: payload.templateId };

    for (const key of Object.keys(payload)) {
      if (typeof payload[key] === 'string') {
        payload[key] = await (this as unknown as ApiPlugin).replaceAllVariables(
          payload[key] as string,
          payload,
        );
      }
    }

    const emailPayload = {
      ...from,
      personalizations: [
        {
          ...preheader,
          ...subject,
          ...to,
          ...{ dynamic_template_data: payload },
        },
      ],
      ...templateId,
    };

    payload.adapter ??= 'sendgrid';

    if (payload.adapter === 'log') {
      logger.warn('No email provider', { emailPayload });

      return {
        ok: true,
        json: () => Promise.resolve({}),
        statusText: 'OK',
      };
    }

    return await super.makeApiRequest(url, method, emailPayload, headers);
  }

  returnSuccessResponse(callbackAction: string, responseBody: AnyRecord) {
    return super.returnSuccessResponse(callbackAction, {});
  }
}
