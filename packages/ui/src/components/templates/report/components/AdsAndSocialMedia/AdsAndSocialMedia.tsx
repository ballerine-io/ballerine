import React, { FunctionComponent } from 'react';
import { Card, CardContent, CardHeader } from '@/components';
import { TextWithNAFallback } from '@/components/atoms/TextWithNAFallback';
import { ctw } from '@/common';
import { AdExample } from '../AdExample';
import { AdImageWithLink } from '../AdImageWithLink';
import { toTitleCase } from 'string-ts';
import { AnchorIfUrl } from '@/components/atoms/AnchorIfUrl';
import { valueOrNA } from '@ballerine/common';

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
  relatedAdsImages: Array<{
    src: string;
    link: string;
  }>;
}> = ({ violations, mediaPresence, adsImages, relatedAdsSummary, relatedAdsImages }) => {
  return (
    <div className={'space-y-8'}>
      <h3 className={'text-lg font-bold'}>Ads and Social Media Analysis</h3>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Social Media Presence</CardHeader>
        <CardContent className={'space-y-8'}>
          <div className={'grid grid-cols-2 gap-8'}>
            {!!mediaPresence?.length &&
              mediaPresence?.map(({ label, items }) => (
                <div key={label}>
                  <TextWithNAFallback as={'h3'} className="mb-3 font-bold">
                    {toTitleCase(label ?? '')}
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
                              {toTitleCase(label ?? '')}:
                            </TextWithNAFallback>
                            <TextWithNAFallback as={AnchorIfUrl} className={'break-all'}>
                              {value}
                            </TextWithNAFallback>
                          </li>
                        );
                      })}
                    {!items?.length && <li>No social media presence detected.</li>}
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
                title={`${valueOrNA(toTitleCase(provider ?? ''))} Image`}
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
              relatedAdsImages.map(({ src, link }, index) => (
                <AdExample key={src} src={src} link={link} alt={`Ad Example ${index + 1}`} />
              ))}
            {!relatedAdsImages?.length && <>No ads detected.</>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
