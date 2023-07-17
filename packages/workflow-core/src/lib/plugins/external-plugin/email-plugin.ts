import { ApiPlugin } from './api-plugin';
import {IApiPluginParams} from "./types";
import {AnyRecord} from "@ballerine/common";
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
    const from = {email: payload.from}
    const subject = {subject: payload.subject}
    const receivers = (payload.receivers as string[]).map(receiver => {
      return {email: receiver}
    });
    const to = {to: receivers}
    const templateId = {template_id: payload.templateId}

    const emailPayload = {
      personalizations: {
        ...from,
        ...to,
        ...subject,
        ...{dynamic_template_data: payload},
        ...templateId
      }
    }

    return await super.makeApiRequest(url, method, emailPayload, headers);
  }

  returnSuccessResponse(callbackAction: string, responseBody: AnyRecord) {
    return super.returnSuccessResponse(callbackAction, {});
  }
}
