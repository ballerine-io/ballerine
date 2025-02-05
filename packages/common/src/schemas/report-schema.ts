import { z } from 'zod';
import {
  MERCHANT_REPORT_RISK_LEVELS,
  MERCHANT_REPORT_STATUSES,
  MERCHANT_REPORT_TYPES,
} from '../consts';

const FacebookPageSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  likes: z.number(),
  address: z.string().nullable(),
  categories: z.array(z.string()),
  phoneNumber: z.string().nullable(),
  creationDate: z.string(),
  screenshotUrl: z.string().url(),
});

const InstagramPageSchema = z.object({
  id: z.string(),
  url: z.string(),
  username: z.string(),
  biography: z.string().nullable(),
  followers: z.number(),
  categories: z.array(z.string()),
  isVerified: z.boolean(),
  screenshotUrl: z.string().url(),
  isBusinessProfile: z.boolean(),
});

const RiskIndicatorSchema = z
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
    quoteFromSource: z.string().nullish(),
  })
  .passthrough();

const EcosystemRecordSchema = z.object({
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
    status: z.enum([MERCHANT_REPORT_STATUSES[0]!, ...MERCHANT_REPORT_STATUSES.slice(1)]),
    monitoringStatus: z.boolean().nullish(),
    website: z.object({
      url: z.string().url(),
    }),
    customer: z.object({
      ongoingMonitoringEnabled: z.boolean(),
    }),
    business: z.object({
      id: z.string(),
      unsubscribedMonitoringAt: z.string().datetime().nullable(),
    }),
    data: z
      .object({
        lineOfBusiness: z.string().nullish(),
        companyName: z.string().nullish(),
        mcc: z.string().nullish(),
        mccDescription: z.string().nullish(),
        bounceRate: z
          .string()
          .nullish()
          .transform(value => (typeof value === 'string' ? Number(value) : null)),
        timeOnSite: z
          .string()
          .nullish()
          .transform(value => (typeof value === 'string' ? Number(value) : null)),
        pagesPerVisit: z
          .string()
          .nullish()
          .transform(value => (typeof value === 'string' ? Number(value) : null)),
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
        riskScore: z.number().nullish(),
        riskLevel: z.enum(MERCHANT_REPORT_RISK_LEVELS).nullish(),
        isWebsiteOffline: z.boolean().nullish(),
      })
      .passthrough()
      .nullable(),
  })
  .passthrough();
