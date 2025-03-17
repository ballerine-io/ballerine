import { z } from 'zod';
import {
  MERCHANT_REPORT_RISK_LEVELS,
  MERCHANT_REPORT_STATUSES,
  MERCHANT_REPORT_TYPES,
  RISK_INDICATOR_RISK_LEVELS,
} from '../consts';

export const FacebookPageSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  likes: z.number().nullish(),
  address: z.string().nullish(),
  categories: z.array(z.string()).nullish(),
  phoneNumber: z.string().nullish(),
  creationDate: z.string().nullish(),
  screenshotUrl: z.string().url().nullish(),
});

export const InstagramPageSchema = z.object({
  id: z.string(),
  url: z.string(),
  username: z.string().nullish(),
  biography: z.string().nullish(),
  followers: z.number().nullish(),
  categories: z.array(z.string()).nullish(),
  isVerified: z.boolean().nullish(),
  screenshotUrl: z.string().url().nullish(),
  isBusinessProfile: z.boolean().nullish(),
});

export const RiskIndicatorSchema = z
  .object({
    id: z.string(),
    name: z.string().nullish(),
    sourceUrl: z.string().nullish(),
    screenshot: z
      .object({
        screenshotUrl: z.string().url().nullish(),
      })
      .nullish(),
    explanation: z.string().nullish(),
    reason: z.string().nullish(),
    quoteFromSource: z.string().nullish(),
    riskLevel: z.enum(RISK_INDICATOR_RISK_LEVELS).nullish(),
    pricingViolationExamples: z.array(z.string()).nullish(),
  })
  .passthrough();

export const EcosystemRecordSchema = z.object({
  domain: z.string(),
  relatedNode: z.string(),
  relatedNodeType: z.string(),
});

export const ReportSchema = z
  .object({
    id: z.string(),
    reportType: z.enum([MERCHANT_REPORT_TYPES[0]!, ...MERCHANT_REPORT_TYPES.slice(1)]),
    createdAt: z
      .string()
      .datetime()
      .transform(value => new Date(value)),
    updatedAt: z
      .string()
      .datetime()
      .transform(value => new Date(value)),
    displayDate: z
      .string()
      .datetime()
      .transform(value => new Date(value)),
    publishedAt: z
      .string()
      .datetime()
      .nullish()
      .transform(value => (value ? new Date(value) : null)),
    status: z.enum([MERCHANT_REPORT_STATUSES[0]!, ...MERCHANT_REPORT_STATUSES.slice(1)]),
    monitoringStatus: z.boolean().nullish(),
    website: z.object({
      url: z.string().url(),
    }),
    customer: z.object({
      id: z.string(),
      displayName: z.string(),
      ongoingMonitoringEnabled: z.boolean(),
    }),
    business: z.object({
      id: z.string(),
      correlationId: z.string().nullish(),
      unsubscribedMonitoringAt: z.string().datetime().nullable(),
    }),
    metadata: z.record(z.string(), z.unknown()).nullish(),
    companyName: z.string().nullish(),
    riskLevel: z.enum(MERCHANT_REPORT_RISK_LEVELS).nullish(),
    isAlert: z.boolean().nullish(),
    data: z
      .object({
        lineOfBusiness: z.string().nullish(),
        companyName: z.string().nullish(),
        mcc: z.string().nullish(),
        mccDescription: z.string().nullish(),
        bounceRate: z.string().nullish(),
        timeOnSite: z.string().nullish(),
        pagesPerVisit: z.string().nullish(),
        trafficSources: z.record(z.string(), z.number()).nullish(),
        monthlyVisits: z.record(z.string(), z.number()).nullish(),
        facebookPage: FacebookPageSchema.nullish(),
        instagramPage: InstagramPageSchema.nullish(),
        trafficRiskIndicators: z.array(RiskIndicatorSchema).nullish(),
        companyReputationRiskIndicators: z.array(RiskIndicatorSchema).nullish(),
        websiteReputationRiskIndicators: z.array(RiskIndicatorSchema).nullish(),
        contentRiskIndicators: z.array(RiskIndicatorSchema).nullish(),
        pricingRiskIndicators: z.array(RiskIndicatorSchema).nullish(),
        websiteStructureRiskIndicators: z.array(RiskIndicatorSchema).nullish(),
        homePageScreenshotUrl: z.string().url().nullish(),
        ecosystem: z.array(EcosystemRecordSchema).nullish(),
        isAlert: z.boolean().nullish(),
        summary: z.string().nullish(),
        ongoingMonitoringSummary: z.string().nullish(),
        riskScore: z.coerce.number().nullish(),
        riskLevel: z.enum(MERCHANT_REPORT_RISK_LEVELS).nullish(),
        isWebsiteOffline: z.boolean().nullish(),
        allViolations: z
          .array(RiskIndicatorSchema.pick({ id: true, name: true, riskLevel: true }))
          .nullish(),
      })
      .passthrough()
      .nullable()
      .default({}),
  })
  .passthrough();
