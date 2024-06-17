import React, { FunctionComponent } from 'react';
import { RiskIndicators } from '@/common/components/molecules/RiskIndicators/RiskIndicators';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { titleCase } from 'string-ts';
import { ctw } from '@/common/utils/ctw/ctw';
import { AnchorIfUrl } from '@/common/components/atoms/AnchorIfUrl/AnchorIfUrl';
import { AdImageWithLink } from '@/domains/business-reports/components/AdImageWithLink/AdImageWithLink';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { AdExample } from '@/domains/business-reports/components/AdExample/AdExample';

export const AdsAndSocialMedia: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  mediaPresence: Array<{
    label: string;
    items: Array<{
      label: string;
      value: string;
    }>;
  }>;
  adsImages: Array<{
    provider: string;
    src: string;
    link: string;
  }>;
  relatedAdsSummary: string;
  relatedAdsImages: string[];
}> = ({ violations, mediaPresence, adsImages, relatedAdsSummary, relatedAdsImages }) => {
  return (
    <div className={'space-y-8'}>
      <h3 className={'text-lg font-bold'}>Ads and Social Media Analysis</h3>
      <RiskIndicators violations={violations} />
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Social Media Presence</CardHeader>
        <CardContent className={'space-y-8'}>
          <div className={'grid grid-cols-2 gap-8'}>
            {!!mediaPresence?.length &&
              mediaPresence?.map(({ label, items }) => (
                <div key={label}>
                  <TextWithNAFallback as={'h3'} className="mb-3 font-bold">
                    {titleCase(label ?? '')}
                  </TextWithNAFallback>
                  <ul
                    className={ctw('space-y-1', {
                      'ps-4': !!items?.length,
                    })}
                  >
                    {!!items?.length &&
                      items.map(({ label, value }) => {
                        return (
                          <li key={label} className={'list-disc'}>
                            <TextWithNAFallback className={'me-2 font-semibold'}>
                              {titleCase(label ?? '')}:
                            </TextWithNAFallback>
                            <TextWithNAFallback as={AnchorIfUrl} className={'break-all'}>
                              {value}
                            </TextWithNAFallback>
                          </li>
                        );
                      })}
                    {!items?.length && <li>No media presence detected.</li>}
                  </ul>
                </div>
              ))}
            {!mediaPresence?.length && (
              <div>
                <ul>
                  <li>No social media presence detected.</li>
                </ul>
              </div>
            )}
          </div>
          <div className={'grid grid-cols-[400px_400px] gap-8'}>
            {adsImages.map(({ provider, src, link }, index) => (
              <AdImageWithLink
                title={`${valueOrNA(titleCase(provider ?? ''))} Image`}
                key={src}
                src={src}
                alt={`${provider} ad ${index + 1}`}
                link={link}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Related Ads</CardHeader>
        <CardContent className={'flex flex-col space-y-4'}>
          <div className={'grid grid-cols-[400px_400px] gap-8'}>
            {!!relatedAdsImages?.length &&
              relatedAdsImages.map((src, index) => (
                <AdExample key={src} src={src} alt={`Ad Example ${index + 1}`} />
              ))}
            {!relatedAdsImages?.length && <>No ads detected.</>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
