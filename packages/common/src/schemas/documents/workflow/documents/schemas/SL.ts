import { TDocument } from '../types';
import { Type } from '@sinclair/typebox';

// Example patterns and helper types for Sierra Leone:
const slNationalIdPattern = '^SL[0-9]{9}$'; // e.g., SL followed by 9 digits
const alphaNumeric = '^[a-zA-Z0-9]*$';
const alphaNumericWithSpaces = '^[\\sa-zA-Z0-9]*$';
const slPhonePattern = '^232[0-9]{8}$'; // Country code 232 followed by 8 digits

const TypeAlphanumericString = Type.String({ pattern: alphaNumeric });
const TypeNonEmptyAlphanumericString = Type.String({ pattern: alphaNumeric, minLength: 1 });
const TypeAlphanumericWithSpacesString = Type.String({ pattern: alphaNumericWithSpaces });
const TypeNonEmptyString = Type.String({ minLength: 1 });
const TypeMoreThan1Word = Type.String({ pattern: '^\\w+(\\s+\\w+)+$' });

const TypePastDate = Type.String({
  format: 'date',
  formatMaximum: new Date().toISOString().split('T')[0],
});
const TypeFutureDate = Type.String({
  format: 'date',
  formatMinimum: new Date().toISOString().split('T')[0],
});

const TypeStringEnum = <T extends string[]>(values: [...T]) =>
  Type.Unsafe<T[number]>({
    type: 'string',
    enum: values,
  });

export const getSierraLeoneDocuments = (): TDocument[] => {
  return [
    // Proof of Registration
    {
      category: 'business_document',
      type: 'certificate_of_incorporation', // Establishes a company as a separate legal entity.
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: TypeNonEmptyString,
        registrationNumber: TypeAlphanumericString,
        taxIdNumber: Type.Optional(TypeAlphanumericString), // If applicable
        issueDate: TypePastDate,
        // Possibly issued by Corporate Affairs Commission (CAC)
        issuerName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'business_document',
      type: 'business_registration_certificate', // Registers a business to legally operate in a jurisdiction.
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        registrationNumber: TypeNonEmptyAlphanumericString,
        businessName: TypeNonEmptyString,
        taxIdNumber: Type.Optional(TypeAlphanumericString), // If applicable
        issueDate: TypePastDate,
        ownerName: Type.String(), // For SMEs or sole proprietors
      }),
    },
    {
      category: 'business_document',
      type: 'trade_license',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: TypeNonEmptyString,
        licenseNumber: TypeAlphanumericString,
        issuerName: Type.Optional(Type.String()), // e.g., Local council authority
        expirationDate: TypeFutureDate,
        ownerName: Type.String(),
      }),
    },
    {
      category: 'proof_of_registration',
      type: 'certificate_of_incorporation', // can also be used for proof of registration
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: TypeNonEmptyString,
        registrationNumber: TypeAlphanumericString,
        issueDate: TypePastDate,
        taxIdNumber: Type.Optional(TypeAlphanumericString), // If applicable
        issuerName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_registration',
      type: 'business_registration_certificate',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        registrationNumber: TypeNonEmptyAlphanumericString,
        businessName: TypeNonEmptyString,
        taxIdNumber: Type.Optional(TypeAlphanumericString),
        issueDate: TypePastDate,
        ownerName: Type.String(),
      }),
    },

    // Operating Permits and Trade Licenses (for small businesses and traders)

    {
      category: 'proof_of_registration',
      type: 'trade_license',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: TypeNonEmptyString,
        licenseNumber: TypeAlphanumericString,
        issuerName: Type.Optional(Type.String()),
        expirationDate: Type.String({ format: 'date' }),
      }),
    },

    // Financial Information (Mobile Money Statements, Bank Statements)
    {
      category: 'financial_information',
      type: 'afrimoney_statement',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        msisdn: Type.String({ pattern: slPhonePattern }),
        accountHolderName: TypeNonEmptyString,
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        timeRun: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'financial_information',
      type: 'orange_money_statement',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        msisdn: Type.String({ pattern: slPhonePattern }),
        accountHolderName: TypeNonEmptyString,
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        timeRun: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'financial_information',
      type: 'bank_statement',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        bankName: TypeStringEnum([
          'Sierra Leone Commercial Bank',
          'Rokel Commercial Bank',
          'Union Trust Bank',
          'Ecobank Sierra Leone',
          'Guaranty Trust Bank (SL) Ltd',
          'Zenith Bank (SL)',
          'FBNBank Sierra Leone Limited',
          'Standard Chartered Bank Sierra Leone',
          'Access Bank Sierra Leone',
          'UBA Sierra Leone',
          'Other',
        ]),
        printDate: Type.Optional(Type.String({ format: 'date-time' })),
        accountHolderName: TypeNonEmptyString,
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        accountNumber: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'financial_information',
      type: 'corporate_tax_certificate',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        taxIdNumber: Type.Optional(Type.String()),
        issueDate: Type.Optional(TypePastDate),
      }),
    },
    {
      category: 'financial_information',
      type: 'transaction_data_last_3_6_months', // e.g., for mobile money or bank accounts or receipts
      issuer: {
        type: 'private',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        from: Type.Optional(Type.String({ format: 'date' })),
        to: Type.Optional(Type.String({ format: 'date' })),
        totalTransactions: Type.Optional(Type.Number()),
      }),
    },

    // Proof of Address (For a range of formal and informal documents)
    {
      category: 'proof_of_address',
      type: 'electricity_bill',
      issuer: {
        type: 'local_authority',
        name: 'Electricity Distribution and Supply Authority (EDSA)',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        nationalIdNumber: Type.Optional(Type.String({ pattern: slNationalIdPattern })),
        docNumber: TypeAlphanumericString,
        userAddress: TypeNonEmptyString,
        physicalAddress: TypeNonEmptyString,
        amountDue: Type.Number(),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_address',
      type: 'water_bill',
      issuer: {
        type: 'local_authority',
        name: 'Guma Valley Water Company',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        name: TypeNonEmptyString,
        nationalIdNumber: Type.Optional(Type.String({ pattern: slNationalIdPattern })),
        userAddress: TypeNonEmptyString,
        physicalAddress: TypeNonEmptyString,
        amountDue: Type.Number(),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_address',
      type: 'tenancy_agreement',
      issuer: {
        type: 'private',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        tenantName: TypeMoreThan1Word,
        addressInTenancyAgreement: TypeMoreThan1Word,
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_address',
      type: 'local_council_tax_receipt',
      issuer: {
        type: 'local_authority',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        payerName: TypeNonEmptyString,
        address: TypeNonEmptyString,
        issueDate: TypePastDate,
        docNumber: TypeAlphanumericString,
      }),
    },
    {
      category: 'proof_of_address',
      type: 'community_leader_letter',
      issuer: {
        type: 'private',
        name: 'Community Elder / Chief',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        name: TypeMoreThan1Word,
        address: TypeMoreThan1Word,
        issueDate: TypePastDate,
        // May not have a national ID number, but could have a phone number
        contactNumber: Type.Optional(Type.String({ pattern: slPhonePattern })),
      }),
    },
    {
      category: 'proof_of_location',
      type: 'front_door_photo',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_location',
      type: 'interior_office_photo',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
      }),
    },

    // Proof of Employment (For both formal and informal employment)
    {
      category: 'proof_of_employment',
      type: 'payslip',
      issuer: {
        type: 'private',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        nationalIdNumber: Type.Optional(Type.String({ pattern: slNationalIdPattern })),
        docNumber: TypeAlphanumericString,
        employeeName: TypeNonEmptyString,
        position: Type.String(),
        salaryAmount: Type.Number({ minimum: 1 }),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_employment',
      type: 'appointment_letter',
      issuer: {
        type: 'private',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        nationalIdNumber: Type.Optional(Type.String({ pattern: slNationalIdPattern })),
        docNumber: TypeAlphanumericString,
        employeeName: TypeNonEmptyString,
        position: Type.String(),
        employerName: TypeNonEmptyString,
        salaryAmount: Type.Optional(Type.Number({ minimum: 1 })),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_employment',
      type: 'market_association_card',
      issuer: {
        type: 'private',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      // For informal traders / petty traders recognized by local market associations
      propertiesSchema: Type.Object({
        associationName: TypeNonEmptyString,
        traderName: TypeNonEmptyString,
        docNumber: TypeAlphanumericString,
        issuanceDate: TypePastDate,
        marketLocation: TypeNonEmptyString,
      }),
    },

    // Proof of Ownership (Receipts, Permits, Property Rates)
    {
      category: 'proof_of_ownership',
      type: 'receipt_for_permit',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: TypeNonEmptyString,
        issueDate: TypePastDate,
        docNumber: TypeAlphanumericString,
      }),
    },
    {
      category: 'proof_of_ownership',
      type: 'property_rate',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: TypeNonEmptyString,
        payerName: TypeNonEmptyString,
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_ownership',
      type: 'business_utility_bill',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: TypeNonEmptyString,
        payerName: TypeNonEmptyString,
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_ownership',
      type: 'certificate_of_directors_and_shareholders',
      issuer: { country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        directors: Type.Optional(Type.String()),
        shareholders: Type.Optional(Type.String()),
        issueDate: Type.Optional(TypePastDate),
      }),
    },

    // ID Documents (For completeness, even if not explicitly requested)
    {
      category: 'proof_of_identity',
      type: 'passport',
      issuer: { type: 'government', country: 'SL' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        documentNumber: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
        placeOfIssue: Type.Optional(Type.String()),
        issueDate: TypePastDate,
        expires: Type.Optional(Type.String({ format: 'date' })),
        dateOfBirth: TypePastDate,
        placeOfBirth: Type.Optional(Type.String()),
        sex: Type.Optional(TypeStringEnum(['M', 'F', 'O'])),
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'national_id',
      issuer: {
        type: 'government',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        firstName: Type.String(),
        middleName: Type.Optional(Type.String()),
        lastName: Type.String(),
        nationalIdNumber: Type.String({ pattern: slNationalIdPattern }),
        authority: Type.Optional(Type.String()),
        placeOfIssue: Type.Optional(Type.String()),
        issueDate: TypePastDate,
        expires: Type.Optional(Type.String({ format: 'date' })),
        dateOfBirth: TypePastDate,
        placeOfBirth: Type.Optional(Type.String()),
        sex: Type.Optional(TypeStringEnum(['M', 'F', 'O'])),
      }),
    },

    {
      category: 'proof_of_identity',
      type: 'voter_id',
      issuer: {
        type: 'government',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        firstName: Type.String(),
        lastName: Type.String(),
        voterIdNumber: TypeAlphanumericString,
        issueDate: TypePastDate,
        dateOfBirth: TypePastDate,
        address: Type.Optional(TypeNonEmptyString),
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'drivers_license',
      issuer: {
        type: 'government',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        firstName: TypeNonEmptyString,
        middleName: Type.Optional(TypeNonEmptyString),
        lastName: TypeNonEmptyString,
        licenseNumber: TypeAlphanumericString,
        authority: Type.Optional(Type.String({ minLength: 1 })), // e.g. Sierra Leone Road Transport Authority (SLRTA)
        issueDate: TypePastDate,
        expires: Type.Optional(Type.String({ format: 'date' })),
        dateOfBirth: TypePastDate,
        address: Type.Optional(TypeNonEmptyString),
        sex: Type.Optional(TypeStringEnum(['M', 'F', 'O'])),
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'school_id',
      issuer: {
        type: 'private',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        firstName: TypeNonEmptyString,
        middleName: Type.Optional(TypeNonEmptyString),
        lastName: TypeNonEmptyString,
        studentIdNumber: TypeAlphanumericString,
        institutionName: TypeNonEmptyString, // e.g. University of Sierra Leone
        courseOfStudy: Type.Optional(TypeNonEmptyString),
        issueDate: TypePastDate,
        expirationDate: Type.Optional(TypeFutureDate),
        dateOfBirth: TypePastDate,
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'employee_id',
      issuer: {
        type: 'private',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        employeeName: TypeNonEmptyString,
        employeeIdNumber: TypeAlphanumericString,
        employerName: TypeNonEmptyString,
        position: Type.Optional(TypeNonEmptyString),
        dateOfBirth: Type.Optional(TypePastDate),
        issueDate: TypePastDate,
        // Optionally include a national ID reference if the employer collects it
        nationalIdNumber: Type.Optional(Type.String({ pattern: slNationalIdPattern })),
      }),
    },

    // Selfie (for identity verification)
    {
      category: 'proof_of_identity_ownership',
      type: 'selfie',
      issuer: {
        type: 'local_authority',
        country: 'SL',
      },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        firstName: Type.String(),
        middleName: Type.Optional(Type.String()),
        lastName: Type.String(),
        dateOfBirth: TypePastDate,
        sex: Type.Optional(TypeStringEnum(['M', 'F', 'O'])),
        // Additional metadata if needed
      }),
    },
  ];
};
