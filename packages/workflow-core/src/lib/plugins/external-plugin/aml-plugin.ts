import { ApiPlugin } from './api-plugin';
import { AnyRecord } from '@ballerine/common';
import * as countries from 'i18n-iso-countries';

export class AmlPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'aml';

  async makeApiRequest(
    url: string,
    method: ApiPlugin['method'],
    payload: AnyRecord,
    headers: HeadersInit,
  ) {
    const {
      countryOfIncorporation = '',
      state: stateCode = '',
      companyName = '',
      vendor = 'asia-verify',
    } = payload;

    if (typeof companyName !== 'string' || companyName === '') {
      throw new Error('Invalid companyName for AML process');
    }

    const countryCode = countries.getAlpha2Code(countryOfIncorporation as string, 'en');

    if (typeof countryCode !== 'string') {
      throw new Error('Invalid countryOfIncorporation for KYB process');
    }

    const jurisdictionCode =
      stateCode && typeof stateCode === 'string' && stateCode.length === 2
        ? `${countryCode}-${stateCode}`
        : countryCode;

    const formattedUrl = `${url}/${jurisdictionCode}/${companyName}/sanctions`;

    return await super.makeApiRequest(formattedUrl, method, { vendor: vendor }, headers);
  }
}
