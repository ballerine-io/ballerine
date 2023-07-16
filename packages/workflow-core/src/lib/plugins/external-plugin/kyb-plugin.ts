import { ApiPlugin } from './api-plugin';
import { AnyRecord } from '@ballerine/common';
import * as countries from 'i18n-iso-countries';

// This is currently only uses only open corp.

export class KybPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'kyb';

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ) {
    const countryOfIncorporation = payload.countryOfIncorporation;
    const companyNumber = payload.companyNumber;
    // TODO: for  US, Canada, and UAE - state code is required
    // const optionalState = payload.state;

    if (typeof countryOfIncorporation !== 'string')
      throw new Error('Invalid countryOfIncorporation for KYB process');
    if (typeof companyNumber !== 'string') throw new Error('Invalid companyNumber for KYB process');
    const countryCode = countries.getAlpha2Code(countryOfIncorporation, 'en');
    const formattedUrl = `${url}/${countryCode}/${companyNumber}`;

    return await super.makeApiRequest(formattedUrl, method, payload, headers);
  }
}
