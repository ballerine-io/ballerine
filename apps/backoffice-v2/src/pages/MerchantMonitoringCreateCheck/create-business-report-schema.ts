import { z } from 'zod';
import { countryCodes } from '@ballerine/common';

import { URL_REGEX } from '@/common/constants';

export const CreateBusinessReportSchema = z.object({
  websiteUrl: z.string().regex(URL_REGEX, {
    message: 'Invalid website URL',
  }),
  companyName: z
    .string({
      invalid_type_error: 'Company name must be a string',
    })
    .max(255)
    .optional(),
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
  businessCorrelationId: z
    .string({
      invalid_type_error: 'Business ID must be a string',
    })
    .max(255)
    .optional(),
});
