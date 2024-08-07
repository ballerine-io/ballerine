import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import React, { FunctionComponent } from 'react';
import { Card, CardContent, CardHeader } from '@/components';
import { ctw } from '@/common';
import { BallerineLink } from '@/components/atoms/BallerineLink/BallerineLink';

export const WebsiteCredibility: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  onlineReputationAnalysis: Array<{ label: string; url: string }>;
  pricingAnalysis: string[];
  websiteStructureAndContentEvaluation: string[];
  trafficAnalysis: Array<{
    label: string;
    items: string[];
  }>;
}> = ({
  violations,
  onlineReputationAnalysis,
  pricingAnalysis,
  websiteStructureAndContentEvaluation,
  trafficAnalysis,
}) => {
  const isEmptyTrafficAnalysis = !trafficAnalysis.flatMap(({ items }) => items)?.length;

  return (
    <div className={'space-y-8'}>
      <h3 className={'col-span-full text-lg font-bold'}>Website Credibility Analysis</h3>
      <RiskIndicators violations={violations} />
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Online Reputation Analysis</CardHeader>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!onlineReputationAnalysis?.length,
            })}
          >
            {!!onlineReputationAnalysis?.length &&
              onlineReputationAnalysis.map(({ label, url }) => (
                <li key={label} className={'list-decimal'}>
                  {label}
                  {!!url && (
                    <span className={'ms-4'}>
                      (<BallerineLink href={url}>source</BallerineLink>)
                    </span>
                  )}
                </li>
              ))}
            {!onlineReputationAnalysis?.length && <li>No Indications Detected.</li>}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Pricing Analysis</CardHeader>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!pricingAnalysis?.length,
            })}
          >
            {!!pricingAnalysis?.length &&
              pricingAnalysis.map(warning => (
                <li key={warning} className={'list-decimal'}>
                  {warning}
                </li>
              ))}
            {!pricingAnalysis?.length && <li>No Indications Detected.</li>}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>
          Website Structure and Content Evaluation
        </CardHeader>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!websiteStructureAndContentEvaluation?.length,
            })}
          >
            {!!websiteStructureAndContentEvaluation?.length &&
              websiteStructureAndContentEvaluation.map(warning => (
                <li key={warning} className={'list-decimal'}>
                  {warning}
                </li>
              ))}
            {!websiteStructureAndContentEvaluation?.length && <li>No Indications Detected.</li>}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Traffic Analysis</CardHeader>
        <CardContent className={'space-y-4'}>
          {!isEmptyTrafficAnalysis &&
            trafficAnalysis?.map(({ label, items }) => (
              <ul className={'ps-4'} key={label}>
                <li className={'list-disc'}>{label}</li>
                <ul className={'ps-4'}>
                  {!!items?.length &&
                    items.map(item => (
                      <li key={label} className={'list-disc'}>
                        {item}
                      </li>
                    ))}
                  {!isEmptyTrafficAnalysis && !items?.length && (
                    <li>No {label?.toLowerCase()} detected.</li>
                  )}
                </ul>
              </ul>
            ))}
          {isEmptyTrafficAnalysis && <>No Indications Detected.</>}
        </CardContent>
      </Card>
    </div>
  );
};
