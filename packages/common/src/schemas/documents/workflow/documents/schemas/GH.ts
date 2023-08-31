import { TDocument } from '../types';
import { Type } from '@sinclair/typebox';

const ghNationalIdNumber = '^$|^GHA-\\d{9}-\\d{1}$';
const alphaNumeric = '^[a-zA-Z0-9]*$';

export const getGhanaDocuments = (): TDocument[] => {
  const TypeAlphanumericString = Type.String({ pattern: '^[a-zA-Z0-9]*$' });
  const TypePastDate = Type.String({
    format: 'date',
    formatMaximum: new Date().toISOString().split('T')[0], // @TODO: Test this
  });
  const TypeFutureDate = Type.String({
    format: 'date',
    formatMinimum: new Date().toISOString().split('T')[0],
  });
  const TypeNationalIdNumber = Type.String({ pattern: ghNationalIdNumber });
  const TypeStringAtLeastOneWord = Type.String({ minLength: 1 });

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
        accountHolderName: TypeStringAtLeastOneWord,
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        timeRun: Type.String({ format: 'iso-date-time' }),
      }),
    },
    {
      category: 'financial_information',
      type: 'bank_statement',
      issuer: { country: 'GH' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        issuer: Type.Union([
          Type.Literal('Absa Bank Ghana Limited'),
          Type.Literal('Access Bank Ghana Plc'),
          Type.Literal('Agricultural Development Bank of Ghana'),
          Type.Literal('Bank of Africa Ghana Limited'),
          Type.Literal('CalBank Limited'),
          Type.Literal('Consolidated Bank Ghana Limited'),
          Type.Literal('Ecobank Ghana Limited'),
          Type.Literal('FBN Bank Ghana Limited'),
          Type.Literal('Fidelity Bank Ghana Limited'),
          Type.Literal('First Atlantic Bank Limited'),
          Type.Literal('First National Bank Ghana'),
          Type.Literal('GCB Bank Limited'),
          Type.Literal('Guaranty Trust Bank Ghana Limited'),
          Type.Literal('National Investment Bank Limited'),
          Type.Literal('OmniBSIC Bank Ghana Limited'),
          Type.Literal('Prudential Bank Limited'),
          Type.Literal('Republic Bank Ghana'),
          Type.Literal('Societe Generale Ghana Limited'),
          Type.Literal('Stanbic Bank Ghana Limited'),
          Type.Literal('Standard Chartered Bank Ghana Limited'),
          Type.Literal('United Bank for Africa Ghana Limited'),
          Type.Literal('Zenith Bank Ghana Limited'),
        ]),
        printDate: Type.String({ format: 'iso-date-time' }),
        accountHolderName: TypeStringAtLeastOneWord,
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        accountNumber: Type.Optional(Type.String()),
      }),
    },

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
      issuer: { country: 'UG' },
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
      issuer: { country: 'UG' },
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
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        certificateNumber: TypeAlphanumericString,
        businessName: TypeAlphanumericString,
        registrationNumber: Type.Optional(TypeAlphanumericString),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_registration',
      type: 'form_a',
      issuer: {
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        required: ['registrationNumber', 'taxIdNumber'],
        properties: {
          registrationNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
          taxIdNumber: {
            type: 'string',
            pattern: alphaNumeric,
          },
        },
      },
    },
    {
      category: 'proof_of_registration',
      type: 'shareholder_details',
      issuer: {
        country: 'GH',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {
        type: 'object',
        required: ['firstName', 'lastName'],
        properties: {
          firstName: {
            type: 'string',
          },
          middleName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
        },
      },
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
      type: 'permit',
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
        issueDate: TypePastDate,
      }),
    },
  ];
};
