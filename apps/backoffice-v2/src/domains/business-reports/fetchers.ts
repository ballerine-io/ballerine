import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { TBusinessReportType } from '@/domains/business-reports/types';
import qs from 'qs';
import { Severities, TObjectValues } from '@/common/types';

export const BusinessReportStatus = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type TBusinessReportStatus = TObjectValues<typeof BusinessReportStatus>;

export type TBusinessReportStatuses = TBusinessReportStatus[];

export const BusinessReportStatuses = [
  BusinessReportStatus.IN_PROGRESS,
  BusinessReportStatus.COMPLETED,
] as const satisfies readonly TBusinessReportStatus[];

export const SeveritySchema = z.preprocess(value => {
  if (value === 'moderate') {
    return 'medium';
  }

  if (value === 'positive') {
    return 'low';
  }

  return value;
}, z.enum(Severities));

export const BusinessReportSchema = z
  .object({
    id: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    riskScore: z.number(),
    status: z.enum(BusinessReportStatuses),
    report: z.object({
      reportFileId: z.string(),
      data: z.object({
        summary: z.object({
          riskScore: z.number(),
          summary: z.union([z.string(), z.undefined()]),
          riskLevels: z.union([
            z.object({
              legalRisk: SeveritySchema,
              chargebackRisk: SeveritySchema,
              reputationRisk: SeveritySchema,
              transactionLaunderingRisk: SeveritySchema,
            }),
            z.undefined(),
          ]),
          recommendations: z.union([z.array(z.string()), z.undefined()]),
          riskIndicatorsByDomain: z.union([
            z.object({
              companyNameViolations: z.array(
                z.object({
                  name: z.string(),
                  riskLevel: z.string(),
                }),
              ),
              adsAndSocialViolations: z.array(
                z.object({
                  name: z.string(),
                  riskLevel: z.string(),
                }),
              ),
              lineOfBusinessViolations: z.array(
                z.object({
                  name: z.string(),
                  riskLevel: z.string(),
                }),
              ),
              ecosystemViolations: z.array(
                z.object({
                  name: z.string(),
                  riskLevel: z.string(),
                }),
              ),
              tldViolations: z.array(
                z.object({
                  name: z.string(),
                  riskLevel: z.string(),
                }),
              ),
            }),
            z.undefined(),
          ]),
        }),
        lineOfBusiness: z.union([
          z.object({
            lobDescription: z.string(),
          }),
          z.undefined(),
        ]),
        websiteCompanyAnalysis: z.object({
          scamOrFraud: z.object({
            indicators: z.array(z.string()),
          }),
        }),
        ecosystem: z.object({
          domains: z.array(
            z.object({
              domain: z.string(),
              relatedNode: z.string(),
              relatedNodeType: z.string(),
              indicator: z
                .object({
                  name: z.string(),
                  riskLevel: z.string(),
                })
                .nullable(),
            }),
          ),
        }),
        socialMedia: z.object({
          ads: z.object({
            facebook: z.object({
              adsInformation: z.object({
                id: z.string(),
                link: z.string().url(),
                creationDate: z.string(),
                pageInformation: z
                  .object({
                    categories: z.array(z.string()),
                  })
                  .optional(),
                address: z.string(),
                phoneNumber: z.string().optional(),
                email: z.string().email().optional(),
                numberOfLikes: z.number(),
                numberOfFollowers: z.number(),
              }),
              imageUrl: z.string().url().optional(),
              link: z.string().url(),
              pickedAd: z.object({
                link: z.string().url(),
              }),
            }),
            instagram: z.object({
              adsInformation: z.object({
                id: z.string(),
                link: z.string().url(),
                creationDate: z.string().optional(),
                numberOfFollowers: z.number().optional(),
                pageInformation: z
                  .object({
                    fullName: z.string().optional(),
                    businessCategoryName: z.string(),
                    biography: z.string(),
                    isBusinessAccount: z.boolean(),
                    verified: z.boolean(),
                  })
                  .optional(),
              }),
              imageUrl: z.string().url().optional(),
              link: z.string().url(),
              pickedAd: z.object({
                link: z.string().url(),
              }),
            }),
          }),
          relatedAds: z.object({
            summary: z.string(),
          }),
        }),
        reputation: z.object({
          summary: z.string(),
        }),
      }),
      version: z.number().int().positive().catch(1),
    }),
    business: z
      .object({
        companyName: z.string(),
        country: z.string().nullable(),
        website: z.string().nullable(),
      })
      .nullable(),
  })
  .optional();

export const BusinessReportsSchema = z.array(BusinessReportSchema);

export type TBusinessReport = z.infer<typeof BusinessReportSchema>;

export type TBusinessReports = z.infer<typeof BusinessReportsSchema>;

export const fetchLatestBusinessReport = async ({
  businessId,
  reportType,
}: {
  businessId: string;
  reportType: TBusinessReportType;
}) => {
  const [filter, error] = await apiClient({
    endpoint: `business-reports/latest?businessId=${businessId}&type=${reportType}`,
    method: Method.GET,
    schema: BusinessReportSchema,
  });

  return handleZodError(error, filter);
};

export const fetchBusinessReports = async ({
  reportType,
  ...params
}: {
  reportType: TBusinessReportType;
  page: {
    number: number;
    size: number;
  };
  orderBy: string;
}) => {
  const queryParams = qs.stringify(
    {
      ...params,
      type: reportType,
    },
    { encode: false },
  );

  const [filter, error] = await apiClient({
    endpoint: `business-reports/?${queryParams}`,
    method: Method.GET,
    schema: BusinessReportsSchema,
  });

  return handleZodError(error, filter);
};

export const fetchBusinessReportById = async ({ id }: { id: string }) => {
  const [filter, error] = await apiClient({
    endpoint: `business-reports/${id}`,
    method: Method.GET,
    schema: BusinessReportSchema,
  });

  return handleZodError(error, filter);
};

export const createBusinessReport = async ({
  websiteUrl,
  operatingCountry,
  companyName,
  businessCorrelationId,
  reportType,
}:
  | {
      websiteUrl: string;
      operatingCountry?: string;
      reportType: TBusinessReportType;
      companyName: string;
    }
  | {
      websiteUrl: string;
      operatingCountry?: string;
      reportType: TBusinessReportType;
      businessCorrelationId: string;
    }) => {
  const [businessReport, error] = await apiClient({
    endpoint: `business-reports`,
    method: Method.POST,
    schema: z.undefined(),
    body: {
      websiteUrl,
      countryCode: operatingCountry,
      merchantName: companyName,
      businessCorrelationId,
      reportType,
    },
  });

  return handleZodError(error, businessReport);
};
