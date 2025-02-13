import React, { FunctionComponent } from 'react';
import { ctw, getUniqueRiskIndicators } from '@/common';
import { Card, CardContent, CardHeader } from '@/components/atoms';
import { CheckCircle } from '@/components/atoms/CheckCircle/CheckCircle';
import { WarningFilledSvg } from '@/components/atoms/WarningFilledSvg/WarningFilledSvg';
import { RISK_INDICATOR_RISK_LEVELS_MAP, RiskIndicatorSchema } from '@ballerine/common';
import { z } from 'zod';

export const RiskIndicators: FunctionComponent<{
  riskIndicators: Array<z.infer<typeof RiskIndicatorSchema>>;
}> = ({ riskIndicators }) => {
  const uniqueRiskIndicators = getUniqueRiskIndicators(riskIndicators);

  return (
    <Card>
      <CardHeader className={'pt-4 font-bold'}>Risk Indicators</CardHeader>
      <CardContent>
        <ul className="list-inside list-disc">
          {!!uniqueRiskIndicators?.length &&
            uniqueRiskIndicators.map(riskIndicator => (
              <li key={riskIndicator.name} className="flex list-none items-center text-slate-500">
                {riskIndicator.riskLevel !== RISK_INDICATOR_RISK_LEVELS_MAP.positive && (
                  <WarningFilledSvg
                    className={ctw('me-3 mt-px', {
                      '[&>:not(:first-child)]:stroke-background text-slate-300':
                        riskIndicator.riskLevel === RISK_INDICATOR_RISK_LEVELS_MAP.moderate,
                    })}
                    width={'20'}
                    height={'20'}
                  />
                )}
                {riskIndicator.riskLevel === RISK_INDICATOR_RISK_LEVELS_MAP.positive && (
                  <CheckCircle
                    size={18}
                    className={`stroke-background`}
                    containerProps={{
                      className: 'me-4 bg-success mt-px',
                    }}
                  />
                )}
                {riskIndicator.name}
              </li>
            ))}
          {!uniqueRiskIndicators?.length && (
            <li className="flex list-none items-center text-slate-500">
              <CheckCircle
                size={18}
                className={`stroke-background`}
                containerProps={{
                  className: 'me-3 bg-success mt-px',
                }}
              />
              No Risk Detected
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
