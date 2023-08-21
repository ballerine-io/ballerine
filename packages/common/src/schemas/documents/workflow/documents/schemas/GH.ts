import { TDocument } from '../types';

const ghNationalIdNumber = '^$|^GHA-\\d{9}-\\d{1}$';
const alphaNumeric = '^[a-zA-Z0-9]*$';

export const certificateOfResidenceGH: TDocument = {
  category: 'proof_of_address',
  type: 'water_bill',
  issuer: {
    type: 'local_authority',
    city: 'Accra',
    name: 'Accra Metropolitan Assembly',
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
};

export const ghanaDocuments: TDocument[] = [
  {
    category: 'financial_information',
    type: 'mtn_statement',
    issuer: {
      country: 'GH',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      properties: {
        accountNameHolder: {
          type: 'string',
        },
        msisdn: {
          type: 'string',
          pattern: '^233[0-9]{9}$',
        },
        from: {
          type: 'string',
          format: 'date',
        },
        to: {
          type: 'string',
          format: 'date',
        },
        timeRun: {
          type: 'string',
          format: 'date',
        },
        accountHolderName: {
          type: 'string',
        },
        maxBalanceRecorded: {
          type: 'number',
        },
      },
    },
  },
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
    type: 'birth_certificate',
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
        birthPlace: {
          type: 'string',
        },
        dateOfBirth: {
          type: 'string',
          format: 'date',
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
  {
    category: 'proof_of_registration',
    type: 'certificate_of_registration',
    issuer: {
      country: 'GH',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      // required: ['companyName', 'taxIdNumber', 'registrationNumber'],
      properties: {
        companyName: {
          type: 'string',
        },
        taxIdNumber: {
          type: 'string',
          pattern: alphaNumeric,
        },
        registrationNumber: {
          type: 'string',
          pattern: alphaNumeric,
        },
        issuingDate: {
          type: 'string',
          format: 'date',
        },
      },
    },
  },
  {
    category: 'proof_of_registration',
    type: 'district_assembly_certificate',
    issuer: {
      country: 'GH',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      // required: ['certificateNo', 'companyName'],
      properties: {
        certificateNo: {
          type: 'string',
          pattern: alphaNumeric,
        },
        registrationNumber: {
          type: 'string',
          pattern: alphaNumeric,
        },
        companyName: {
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
    category: 'proof_of_registration',
    type: 'form_a',
    issuer: {
      country: 'GH',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      // required: ['registrationNumber', 'taxIdNumber'],
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
      // required: ['firstName', 'lastName'],
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
  {
    category: 'company_structure',
    type: 'shareholders',
    issuer: {
      type: 'private',
      country: 'GH',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      properties: {
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
  },
  {
    category: 'registration_document',
    type: 'certificate_of_incorporation',
    issuer: {
      type: 'private',
      country: 'GH',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      properties: {
        properties: {
          companyName: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          vat: {
            type: 'string',
          },
          companyType: {
            type: 'string',
          },
          establishmentDate: {
            type: 'string',
          },
        },
      },
    },
  },
  {
    category: 'proof_of_bank_account',
    type: 'bank_statement',
    issuer: {
      type: 'private',
      country: 'GH',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      country: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      holderName: {
        type: 'string',
      },
      accountNumber: {
        type: 'string',
      },
      currency: {
        type: 'string',
      },
    },
  },
];
