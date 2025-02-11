import { RiskIndicatorSchema } from '@ballerine/common';
import { z } from 'zod';

type RiskIndicator = z.infer<typeof RiskIndicatorSchema>;

export const getUniqueRiskIndicators = (riskIndicators: RiskIndicator[]): RiskIndicator[] => {
  if (!riskIndicators) {
    return [];
  }

  const riskIndicatorsMap: Record<string, (typeof riskIndicators)[number]> = {};

  for (const indicator of riskIndicators) {
    if (indicator.id in riskIndicatorsMap) {
      continue;
    }

    riskIndicatorsMap[indicator.id] = indicator;
  }

  return Object.values(riskIndicatorsMap);
};
