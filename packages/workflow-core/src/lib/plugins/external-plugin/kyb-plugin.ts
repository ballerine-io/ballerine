import { ApiPlugin } from './api-plugin';
import { AnyRecord } from '@ballerine/common';
import * as countries from 'i18n-iso-countries';

export class KybPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'kyb';

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ) {
    const {
      countryOfIncorporation = '',
      state: stateCode = '',
      companyNumber = '',
      vendor = 'open-corporates',
    } = payload;

    if (typeof companyNumber !== 'string' || companyNumber === '') {
      throw new Error('Invalid companyNumber for KYB process');
    }

    const countryCode = countries.getAlpha2Code(countryOfIncorporation as string, 'en');

    if (typeof countryCode !== 'string') {
      throw new Error('Invalid countryOfIncorporation for KYB process');
    }

    const jurisdictionCode =
      stateCode && typeof stateCode === 'string' && stateCode.length === 2
        ? `${countryCode}-${stateCode}`
        : countryCode;

    const formattedUrl = `${url}/${jurisdictionCode}/${companyNumber}`;

    return await super.makeApiRequest(formattedUrl, method, { vendor: vendor }, headers);
  }
}
