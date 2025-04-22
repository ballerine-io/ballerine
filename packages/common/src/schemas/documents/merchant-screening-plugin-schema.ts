import { ProcessStatuses } from '@/consts';
import { TypeStringEnum } from '@/schemas/documents/workflow/documents/schemas/utils';
import { Type } from '@sinclair/typebox';

const TerminationReasonCodes = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '20',
  '21',
  '24',
] as const;

const AddressSchema = Type.Object({
  Line1: Type.String({
    description:
      'Line 1 of the street address for the location. Usually includes street number and name.',
    example: '42 ELM AVENUE',
    minLength: 1,
    maxLength: 60,
  }),
  Line2: Type.Optional(
    Type.String({
      description: 'Line 2 of the street address, usually an apartment number or suite number.',
      example: 'SUITE 201',
      maxLength: 60,
    }),
  ),
  City: Type.String({
    description: 'The name of the city for the location.',
    example: 'DALLAS',
    minLength: 1,
    maxLength: 40,
  }),
  CountrySubdivision: Type.Optional(
    Type.String({
      description:
        'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
      example: 'IL',
      maxLength: 2,
    }),
  ),
  Province: Type.Optional(
    Type.String({
      description: 'The name of the province for the location.',
      example: 'US',
      maxLength: 3,
    }),
  ),
  PostalCode: Type.Optional(
    Type.String({
      description: 'The postal code for the location (only supported for US and Canada merchants).',
      example: '66579',
      minLength: 1,
      maxLength: 10,
    }),
  ),
  Country: Type.String({
    description:
      'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
    example: 'USA',
    minLength: 1,
    maxLength: 3,
  }),
});

const DriversLicenseSchema = Type.Object({
  Number: Type.Optional(
    Type.String({
      description: 'The drivers license number of a principal owner.',
      example: 'M15698025',
      maxLength: 25,
    }),
  ),
  CountrySubdivision: Type.Optional(
    Type.String({
      description:
        'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
      example: 'IL',
      maxLength: 2,
    }),
  ),
  Country: Type.Optional(
    Type.String({
      description:
        'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
      example: 'USA',
      maxLength: 3,
    }),
  ),
});

const PrincipalSchema = Type.Object({
  FirstName: Type.String({
    description: 'The first name of the principal owner of the business.',
    example: 'DAVID',
    minLength: 1,
    maxLength: 40,
  }),
  MiddleInitial: Type.Optional(
    Type.String({
      description: 'The middle initial of the name of the principal owner of the business.',
      example: 'P',
    }),
  ),
  LastName: Type.String({
    description: 'The last name of the principal owner of the business.',
    example: 'SMITH',
    minLength: 1,
    maxLength: 40,
  }),
  Address: AddressSchema,
  PhoneNumber: Type.Optional(
    Type.String({
      description: "The principal owner's phone number, including the area code.",
      example: '3165557625',
      maxLength: 25,
    }),
  ),
  AltPhoneNumber: Type.Optional(
    Type.String({
      description: "The principal owner's alternate phone number, including the area code.",
      example: '3165557625',
      maxLength: 25,
    }),
  ),
  NationalId: Type.Optional(
    Type.String({
      description:
        'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
      example: '541022104',
      maxLength: 35,
    }),
  ),
  DriversLicense: Type.Optional(DriversLicenseSchema),
});

const UrlSchema = Type.String({
  description: 'Website address of the merchant. A request may include multiple URLs.',
  example: 'www.testmerchant.com',
  maxLength: 4000,
});

const MerchantMatchSchema = Type.Object({
  Name: Type.String({
    description: 'The name of the Business which has been terminated.',
    example: 'M01',
  }),
  DoingBusinessAsName: Type.String({
    description:
      'The name used by a merchant that could be different from the legal name of the business.',
    example: 'M01',
  }),
  PhoneNumber: Type.String({
    description: 'The Business or Merchant’s phone number.',
    example: 'M01',
  }),
  Address: Type.String({
    description: 'Address of the merchant location.',
    example: 'M01',
  }),
  AltPhoneNumber: Type.String({
    description: 'The Business or Merchant’s alternate phone number.',
    example: 'M01',
  }),
  CountrySubdivisionTaxId: Type.String({
    description:
      'The Merchant’s state tax ID; for the U.S region only. Return value will be hidden.',
    example: 'M01',
  }),
  NationalTaxId: Type.String({
    description:
      'The National tax ID or business registration number. Return value will be hidden.',
    example: 'M02',
  }),
  ServiceProvLegal: Type.String({
    description:
      'The name of the service provider associated with the merchant listed in the MATCH.',
    example: 'M00',
  }),
  ServiceProvDBA: Type.String({
    description:
      'The name of the service provider associated with the merchant listed in the MATCH.',
    example: 'M01',
  }),
  PrincipalMatch: Type.Optional(Type.Array(PrincipalSchema)),
  UrlMatch: Type.Optional(
    Type.Array(
      Type.Object({
        url: Type.String({
          description: 'The URL associated with the Business which has been terminated.',
          example: 'M01',
        }),
      }),
    ),
  ),
});

const MerchantSchema = Type.Object({
  Name: Type.String({
    description: 'The name of the business assigned by the principal owner(s)',
    example: 'THE BAIT SHOP',
    minLength: 1,
    maxLength: 60,
  }),
  DoingBusinessAsName: Type.Optional(
    Type.String({
      description:
        'The name used by a merchant that could be different from the legal name of the business.',
      example: 'BAIT R US',
      maxLength: 110,
    }),
  ),
  Address: Type.Optional(AddressSchema),
  PhoneNumber: Type.Optional(
    Type.String({
      description: "The Business or Merchant's phone number, including the area code.",
      example: '3165557625',
      maxLength: 25,
    }),
  ),
  AltPhoneNumber: Type.Optional(
    Type.String({
      description: "The Business or Merchant's alternate phone number, including the area code.",
      example: '3165557625',
      maxLength: 25,
    }),
  ),
  NationalTaxId: Type.Optional(
    Type.String({
      description: 'The Merchant national tax ID, leave blank if not in the U.S region.',
      example: '888596927',
      maxLength: 35,
    }),
  ),
  CountrySubdivisionTaxId: Type.Optional(
    Type.String({
      description: 'The Merchant Country Subdivision tax ID, leave blank if not in the U.S region.',
      example: '492321030',
      maxLength: 35,
    }),
  ),
  ServiceProvLegal: Type.Optional(
    Type.String({
      description:
        'The name of the service provider associated with the merchant listed in the MATCH.',
      example: 'XYZ FINANCIAL SERVICE INCORPORATED',
      maxLength: 60,
    }),
  ),
  ServiceProvDBA: Type.Optional(
    Type.String({
      description:
        'The name of the service provider associated with the merchant listed in the MATCH.',
      example: 'XYZ FINANCIAL SERVICE',
      maxLength: 60,
    }),
  ),
  Url: Type.Optional(Type.Array(UrlSchema)),
  Principal: Type.Optional(Type.Array(PrincipalSchema)),
  SearchCriteria: Type.Optional(
    Type.Object({
      SearchAll: Type.String({
        description: 'Determines if the inquiry is worldwide or not.',
        example: 'N',
      }),
      Region: Type.Optional(
        Type.Array(
          Type.String({
            description: 'Region in which the inquiry results must be obtained.',
            example: 'A',
          }),
        ),
      ),
      Country: Type.Optional(
        Type.Array(
          Type.String({
            description: 'The three-digit country code of the principal owner.',
            example: 'USA',
          }),
        ),
      ),
      MinPossibleMatchCount: Type.Optional(
        Type.String({
          description:
            'Determines how many minimum matches present for a merchant or inquiry to appear in the results.',
          example: '3',
        }),
      ),
    }),
  ),
  AddedOnDate: Type.Optional(
    Type.String({
      description: 'Date the merchant was added to the MATCH database.',
      example: '10/13/2015',
    }),
  ),
  TerminationReasonCode: Type.Optional(
    TypeStringEnum(TerminationReasonCodes, {
      description: 'A two-digit numeric code indicating why a particular merchant was terminated.',
      example: '13',
      minLength: 2,
      maxLength: 2,
    }),
  ),
  AddedByAcquirerID: Type.Optional(
    Type.String({
      description: 'The Member ICA that has added the merchant to the MATCH system.',
      example: '1234',
      maxLength: 11,
    }),
  ),
  UrlGroup: Type.Optional(
    Type.Array(
      Type.Object({
        ExactMatchUrls: Type.Optional(Type.Array(UrlSchema)),
        CloseMatchUrls: Type.Optional(Type.Array(UrlSchema)),
        NoMatchUrls: Type.Optional(Type.Array(UrlSchema)),
      }),
    ),
  ),
  Comments: Type.Optional(
    Type.String({
      description: 'Brief comments on why the merchant is added.',
      example: 'Added for reasons of fraud',
      maxLength: 500,
    }),
  ),
  MerchantMatch: Type.Optional(MerchantMatchSchema),
});

const TerminatedMerchantSchema = Type.Object({
  Merchant: MerchantSchema,
  MerchantMatch: Type.Optional(MerchantMatchSchema),
});

const InquiredMerchantSchema = Type.Object({
  Merchant: MerchantSchema,
});

const MerchantScreeningRawSchema = Type.Object({
  TerminationInquiry: Type.Object({
    PageOffset: Type.Integer({
      description: 'PageOffset for the inquiry done',
      example: 0,
    }),
    Ref: Type.String({
      description: 'Reference URL to get inquiry',
      example: 'https://api.mastercard.com/fraud/merchant/v3/termination-inquiry/1234567890',
    }),
    TransactionReferenceNumber: Type.String({
      description: 'User-defined identifier for the inquiry submitted.',
      example: '12345',
    }),
    PossibleMerchantMatches: Type.Optional(
      Type.Array(
        Type.Object({
          TotalLength: Type.Integer({
            description:
              'The total length of the result set from possible merchant matches of inquiry.',
            example: 2,
          }),
          TerminatedMerchant: Type.Array(TerminatedMerchantSchema),
        }),
      ),
    ),
    PossibleInquiryMatches: Type.Optional(
      Type.Array(
        Type.Object({
          TotalLength: Type.Integer({
            description:
              'The total length of the result set from possible merchant matches of inquiry.',
            example: 2,
          }),
          InquiredMerchant: Type.Array(InquiredMerchantSchema),
        }),
      ),
    ),
  }),
});

export const MerchantScreeningAggregatedSchema = Type.Object({
  name: Type.String(),
  terminationReasonCode: Type.Optional(
    TypeStringEnum(TerminationReasonCodes, {
      description: 'A two-digit numeric code indicating why a particular merchant was terminated.',
      example: '13',
      minLength: 2,
      maxLength: 2,
    }),
  ),
  dateAdded: Type.Optional(Type.String()),

  exactMatchesAmount: Type.Number(),
  partialMatchesAmount: Type.Number(),

  exactMatches: Type.Record(Type.String(), Type.Any()),
  partialMatches: Type.Record(Type.String(), Type.Any()),

  principals: Type.Array(
    Type.Object({
      exactMatches: Type.Record(Type.String(), Type.Any()),
      partialMatches: Type.Record(Type.String(), Type.Any()),
    }),
  ),
  urls: Type.Array(
    Type.Object({
      exactMatches: Type.Record(Type.String(), Type.Any()),
      partialMatches: Type.Record(Type.String(), Type.Any()),
    }),
  ),
});

export const MerchantScreeningProcessedSchema = Type.Object({
  terminatedMatchedMerchants: Type.Array(
    Type.Composite([
      MerchantScreeningAggregatedSchema,
      Type.Object({
        raw: TerminatedMerchantSchema,
      }),
    ]),
  ),
  inquiredMatchedMerchants: Type.Array(
    Type.Composite([
      MerchantScreeningAggregatedSchema,
      Type.Object({
        raw: InquiredMerchantSchema,
      }),
    ]),
  ),
  checkDate: Type.String(),
});

export const MerchantScreeningPluginSchema = Type.Optional(
  Type.Object({
    name: Type.Optional(Type.Literal('merchantScreening')),
    status: Type.Optional(TypeStringEnum(ProcessStatuses)),
    invokedAt: Type.Optional(Type.Number()),
    vendor: Type.Optional(Type.Literal('mastercard')),
    logoUrl: Type.Optional(Type.String()),
    raw: Type.Optional(MerchantScreeningRawSchema),
    processed: Type.Optional(MerchantScreeningProcessedSchema),
  }),
);
