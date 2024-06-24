import { z } from 'zod';
import { countryCodes } from '@ballerine/common';

const URL_REGEX =
  /((https?):\/\/)?([a-zA-Z0-9-_]+\.)+[a-zA-Z0-9]+(\.[a-z]{2})?(\/[a-zA-Z0-9_#-]+)*(\/)?(\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?/;

export const CreateBusinessReportSchema = z
  .object({
    websiteUrl: z.string().regex(URL_REGEX, {
      message: 'Invalid website URL',
    }),
    companyName: z.union([
      z
        .string({
          required_error: 'Company name is required',
          invalid_type_error: 'Company name must be a string',
        })
        .max(255),
      z.undefined(),
    ]),
    operatingCountry: z.union([
      z.enum(
        // @ts-expect-error - countryCodes is an array of strings but its always the same strings
        countryCodes,
        {
          errorMap: () => {
            return {
              message: 'Invalid operating country',
            };
          },
        },
      ),
      z.undefined(),
    ]),
    businessCorrelationId: z.union([
      z
        .string({
          required_error: 'Business ID is required',
          invalid_type_error: 'Business ID must be a string',
        })
        .max(255),
      z.undefined(),
    ]),
  })
  .superRefine((v, ctx) => {
    if (v.companyName || v.businessCorrelationId) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Company name or business ID must be provided',
      path: ['companyName'],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Company name or business ID must be provided',
      path: ['businessCorrelationId'],
    });
  });
