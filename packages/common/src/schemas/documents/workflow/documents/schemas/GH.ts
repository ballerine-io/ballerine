import { TDocument } from '../types';
import { Type } from '@sinclair/typebox';

const ghNationalIdNumber = '^$|^GHA-\\d{9}-\\d{1}$';
const alphaNumeric = '^[a-zA-Z0-9]*$';

export const getGhanaDocuments = (): TDocument[] => {
  const TypeAlphanumericString = Type.String({ pattern: '^[a-zA-Z0-9]*$' });
  const TypeAlphanumericWithSpacesString = Type.String({ pattern: '^[\\sa-zA-Z0-9]*$' });
  const TypePastDate = Type.String({
    format: 'date',
    formatMaximum: new Date().toISOString().split('T')[0],
  });
  const TypeFutureDate = Type.String({
    format: 'date',
    formatMinimum: new Date().toISOString().split('T')[0],
  });
  const TypeNationalIdNumber = Type.String({ pattern: ghNationalIdNumber });
  const TypeStringAtLeastOneWord = Type.String({ minLength: 1 });
  const TypeStringEnum = <T extends string[]>(values: [...T]) =>
    Type.Unsafe<T[number]>({
      type: 'string',
      enum: values,
    });

  return [
    // Financial Information
    {
      category: 'financial_information',
      type: 'mtn_statement',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        msisdn: Type.String({ pattern: '^233[0-9]{9}$' }),
        accountHolderName: Type.String(),
        from: Type.Optional(Type.String({ format: 'date' })),
        to: Type.Optional(Type.String({ format: 'date' })),
        timeRun: Type.Optional(Type.String()),
      }),
    },

    //     {
    //       category: 'financial_information',
    //       type: 'mtn_statement_businesses',
    //       issuer: { country: 'GH' },
    //       issuingVersion: 1,
    //       version: 1,
    //       propertiesSchema: Type.Object({
    //         msisdn: Type.String({ pattern: '^233[0-9]{9}$' }),
    //         accountHolderName: TypeStringAtLeastOneWord,
    //         from: Type.String({ format: 'date' }),
    //         to: Type.String({ format: 'date' }),
    //         timeRun: Type.String(),
    //       }),
    //     },

    // {
    //   category: 'financial_information',
    //   type: 'bank_statement',
    //   issuer: { country: 'GH' },
    //   issuingVersion: 1,
    //   version: 1,
    //   propertiesSchema: Type.Object({
    //     issuer: TypeStringEnum([
    //       'Absa Bank Ghana Limited',
    //       'Access Bank Ghana Plc',
    //       'Agricultural Development Bank of Ghana',
    //       'Bank of Africa Ghana Limited',
    //       'CalBank Limited',
    //       'Consolidated Bank Ghana Limited',
    //       'Ecobank Ghana Limited',
    //       'FBN Bank Ghana Limited',
    //       'Fidelity Bank Ghana Limited',
    //       'First Atlantic Bank Limited',
    //       'First National Bank Ghana',
    //       'GCB Bank Limited',
    //       'Guaranty Trust Bank Ghana Limited',
    //       'National Investment Bank Limited',
    //       'OmniBSIC Bank Ghana Limited',
    //       'Prudential Bank Limited',
    //       'Republic Bank Ghana',
    //       'Societe Generale Ghana Limited',
    //       'Stanbic Bank Ghana Limited',
    //       'Standard Chartered Bank Ghana Limited',
    //       'United Bank for Africa Ghana Limited',
    //       'Zenith Bank Ghana Limited',
    //     ]),
    //     printDate: Type.String({ format: 'date-time' }),
    //     accountHolderName: TypeStringAtLeastOneWord,
    //     from: Type.String({ format: 'date' }),
    //     to: Type.String({ format: 'date' }),
    //     accountNumber: Type.Optional(Type.String()),
    //   }),
    // },
    // Proof of Address
    {
      category: 'proof_of_address',
      type: 'water_bill',
      issuer: {
        type: 'local_authority',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          amountDue: {
            type: 'number',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_address',
      type: 'electricity_bill',
      issuer: {
        type: 'local_authority',
        city: 'Accra',
        name: 'Electricity Company of Ghana',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          amountDue: {
            type: 'number',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_address',
      type: 'tenancy_agreement',
      issuer: {
        type: 'private',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          rentalAmount: {
            type: 'number',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_address',
      type: 'bank_statement',
      issuer: {
        type: 'bank',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_address',
      type: 'mortgage_statement',
      issuer: {
        type: 'bank',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_address',
      type: 'property_rate',
      issuer: {
        type: 'local_authority',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_address',
      type: 'form_a',
      issuer: {
        type: 'government',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_address',
      type: 'form_3',
      issuer: {
        type: 'government',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_address',
      type: 'form_4',
      issuer: {
        type: 'government',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          userAddress: {
            type: 'string',
          },
          physicalAddress: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },

    // Proof of Employment
    {
      category: 'proof_of_employment',
      type: 'payslip',
      issuer: {
        type: 'private',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          employeeName: {
            type: 'string',
          },
          position: {
            type: 'string',
          },
          salaryAmount: {
            type: 'number',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_employment',
      type: 'appointment_letter',
      issuer: {
        type: 'private',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          employeeName: {
            type: 'string',
          },
          position: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
          salaryAmount: {
            type: 'number',
          },
        },
      },
    },
    {
      category: 'proof_of_employment',
      type: 'ssnit_pension_statement',
      issuer: {
        type: 'government',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          employeeName: {
            type: 'string',
          },
          employerName: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_employment',
      type: 'introductory_letter',
      issuer: {
        type: 'private',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          employeeName: {
            type: 'string',
          },
          position: {
            type: 'string',
          },
          employerName: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_employment',
      type: 'form_a',
      issuer: {
        type: 'private',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          employeeName: {
            type: 'string',
          },
          position: {
            type: 'string',
          },
          employerName: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_employment',
      type: 'form_3',
      issuer: {
        type: 'private',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          employeeName: {
            type: 'string',
          },
          position: {
            type: 'string',
          },
          employerName: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },
    {
      category: 'proof_of_employment',
      type: 'form_4',
      issuer: {
        type: 'private',
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        properties: {
          nationalIdNumber: {
            type: 'string',
            pattern: ghNationalIdNumber,
          },
          docNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          employeeName: {
            type: 'string',
          },
          position: {
            type: 'string',
          },
          employerName: {
            type: 'string',
          },
          issuingDate: {
            type: 'string',
            format: 'date',
          },
        },
      },
    },

    // Proof of Registration
    {
      category: 'proof_of_registration',
      type: 'certificate_of_registration',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        taxIdNumber: TypeAlphanumericString,
        registrationNumber: TypeAlphanumericString,
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_registration',
      type: 'operating_permit',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        registrationNumber: Type.Optional(TypeAlphanumericString),
        issueDate: TypePastDate,
        expirationDate: TypeFutureDate,
      }),
    },
    {
      category: 'proof_of_registration',
      type: 'district_assembly_certificate',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        certificateNumber: TypeAlphanumericString,
        businessName: TypeAlphanumericWithSpacesString,
        registrationNumber: Type.Optional(TypeAlphanumericString),
        issueDate: TypePastDate,
      }),
    },
    // Proof of Ownership
    {
      category: 'proof_of_ownership',
      type: 'form_a',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        registrationNumber: TypeAlphanumericString,
        taxIdNumber: TypeAlphanumericString,
        issueDate: TypePastDate,
        firstName: Type.String(),
        middleName: Type.Optional(Type.String()),
        lastName: Type.String(),
        dateOfBirth: TypePastDate,
        nationalIdNumber: TypeNationalIdNumber,
      }),
    },
    {
      category: 'proof_of_ownership',
      type: 'receipt_for_permit',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_ownership',
      type: 'property_rate',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        payerName: Type.String(),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_ownership',
      type: 'business_utility_bill',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        payerName: Type.String(),
        issueDate: TypePastDate,
      }),
    },
  ];
};
