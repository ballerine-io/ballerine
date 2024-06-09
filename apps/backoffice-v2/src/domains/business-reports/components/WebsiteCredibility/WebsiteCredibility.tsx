import React, { FunctionComponent } from 'react';
import { RiskIndicators } from '@/common/components/molecules/RiskIndicators/RiskIndicators';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';

export const WebsiteCredibility: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  onlineReputationAnalysis: string[];
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
              onlineReputationAnalysis.map(warning => (
                <li key={warning} className={'list-decimal'}>
                  {warning}
                </li>
              ))}
            {!onlineReputationAnalysis?.length && <li>No online reputation analysis found.</li>}
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
            {!pricingAnalysis?.length && <li>No pricing analysis found.</li>}
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
            {!websiteStructureAndContentEvaluation?.length && (
              <li>No website structure and content evaluation found.</li>
            )}
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
                  {!isEmptyTrafficAnalysis && !items?.length && <li>No {label} found.</li>}
                </ul>
              </ul>
            ))}
          {isEmptyTrafficAnalysis && <>No traffic analysis found.</>}
        </CardContent>
      </Card>
    </div>
  );
};
