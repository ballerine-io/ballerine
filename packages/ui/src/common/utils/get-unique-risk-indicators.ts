import { RiskIndicatorSchema } from '@ballerine/common';
import { z } from 'zod';
import { NO_VIOLATION_DETECTED_RISK_INDICATOR_ID } from '../constants';

type RiskIndicator = z.infer<typeof RiskIndicatorSchema>;

export const getUniqueRiskIndicators = (riskIndicators: RiskIndicator[]): RiskIndicator[] => {
  if (!riskIndicators) {
    return [];
  }

  const riskIndicatorsMap: Record<string, (typeof riskIndicators)[number]> = {};

  for (const indicator of riskIndicators) {
    if (
      indicator.id in riskIndicatorsMap ||
      indicator.id === NO_VIOLATION_DETECTED_RISK_INDICATOR_ID
    ) {
      continue;
    }

    riskIndicatorsMap[indicator.id] = indicator;
  }

  return Object.values(riskIndicatorsMap);
};
