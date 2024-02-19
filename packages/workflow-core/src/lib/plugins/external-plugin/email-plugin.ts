import { ApiPlugin } from './api-plugin';
import { IApiPluginParams } from './types';
import { AnyRecord } from '@ballerine/common';
export class EmailPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'email';

  constructor(pluginParams: IApiPluginParams) {
    super(pluginParams);
  }
  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ) {
    const from = { from: { email: payload.from, ...(payload.name ? { name: payload.name } : {}) } };
    const subject = payload.subject
      ? { subject: this.replaceValuePlaceholders(payload.subject as string, payload) }
      : {};
    const preheader = payload.preheader
      ? { preheader: this.replaceValuePlaceholders(payload.preheader as string, payload) }
      : {};
    const receivers = (payload.receivers as string[]).map(receiver => {
      return { email: receiver };
    });
    const to = { to: receivers };
    const templateId = { template_id: payload.templateId };

    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = this.replaceValuePlaceholders(payload[key] as string, payload);
      }
    });
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
      console.log('Skipping email vendor reuqest, Email payload: ', emailPayload);

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
