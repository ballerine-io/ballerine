import {
  isNonEmptyArray,
  RISK_INDICATOR_RISK_LEVELS_MAP,
  RiskIndicatorSchema,
} from '@ballerine/common';
import { z } from 'zod';
import { FunctionComponent } from 'react';

import { ctw } from '@/common';
import { CheckCircle } from '@/components/atoms/CheckCircle/CheckCircle';
import { WarningFilledSvg } from '@/components/atoms/WarningFilledSvg/WarningFilledSvg';

export const RiskIndicator = ({
  title,
  search,
  riskIndicators,
  Link,
}: {
  title: string;
  search?: string;
  riskIndicators: Array<z.infer<typeof RiskIndicatorSchema>> | null;
  Link?: FunctionComponent<{ search: string }>;
}) => {
  return (
    <div>
      <h3 className="mb-3 space-x-4 font-bold text-slate-500">
        <span>{title}</span>
        {search && Link && <Link search={search} />}
      </h3>
      <ul className="list-inside list-disc">
        {!!riskIndicators &&
          isNonEmptyArray(riskIndicators) &&
          riskIndicators.map(riskIndicator => (
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
        {Array.isArray(riskIndicators) && !riskIndicators.length && (
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
    </div>
  );
};
