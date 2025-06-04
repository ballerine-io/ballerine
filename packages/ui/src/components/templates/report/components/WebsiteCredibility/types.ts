import { RiskIndicatorSchema, ReportSchema } from '@ballerine/common';
import { z } from 'zod';
import { engagementMetricsMapper } from './constants';

export type RiskIndicator = z.infer<typeof RiskIndicatorSchema>;
export type TrafficDataType = Pick<
  NonNullable<z.infer<typeof ReportSchema>['data']>,
  | 'trafficSources'
  | 'monthlyVisits'
  | 'pagesPerVisit'
  | 'timeOnSite'
  | 'bounceRate'
  | 'visitorsCountries'
>;

export type WebsiteCredibilityProps = {
  websiteReputationRiskIndicators: Array<RiskIndicator>;
  pricingRiskIndicators: Array<RiskIndicator>;
  websiteStructureRiskIndicators: Array<RiskIndicator>;
  trafficRiskIndicators: Array<RiskIndicator>;
  trafficData: TrafficDataType;
  visitorsCountriesDateRange: string;
};

export type DisplayableMetricType = {
  label: string;
  value: number;
};

export type EngagementType = Readonly<{
  value: string;
  label: keyof typeof engagementMetricsMapper;
}>;
