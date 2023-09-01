import { TDocument } from '@/schemas';
import { Type } from '@sinclair/typebox';

export const getUgandaDocuments = (): TDocument[] => {
  const TypeAlphanumericString = Type.String({ pattern: '^[a-zA-Z0-9]*$' });
  const TypePastDate = Type.String({
    format: 'date',
    formatMaximum: new Date().toISOString().split('T')[0], // @TODO: Test this
  });

  const TypeStringAtLeastOneWord = Type.String({ minLength: 1 });
  return [
    // Proof of Registration
    {
      category: 'proof_of_registration',
      type: 'certificate_of_registration',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        registrationNumber: TypeAlphanumericString,
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_registration',
      type: 'trade_license',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        registrationNumber: TypeAlphanumericString,
        issuer: Type.Union([Type.Literal('KCCA'), Type.Literal('Other')]),
        expirationDate: Type.Optional(TypePastDate),
      }),
    },
    {
      category: 'proof_of_registration',
      type: 'association_letter',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        isOwnerNameOnDocument: Type.Boolean(),
        isValidIssuer: Type.Boolean(),
        isDocumentStampedAndValid: Type.Boolean(),
        issueDate: TypePastDate,
      }),
    },

    // Business Ownership
    {
      category: 'business_ownership',
      type: 'business_registration_form',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        registrationNumber: TypeAlphanumericString,
        businessName: Type.String(),
        taxIdNumber: Type.String(),
        issueDate: TypePastDate,
        ownerName: Type.String(),
      }),
    },

    // Financial Statement
    {
      category: 'financial_information',
      type: 'mtn_statement',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        dateOfStatement: Type.String({ format: 'date-time' }),
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        mobileNumber: Type.String({ pattern: '^233[0-9]{9}$' }),
        accountHolderName: TypeStringAtLeastOneWord,
      }),
    },
    {
      category: 'financial_information',
      type: 'airtel_statement',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        mobileNumber: Type.String({ pattern: '^233[0-9]{9}$' }),
        accountHolderName: TypeStringAtLeastOneWord,
      }),
    },
    {
      category: 'financial_information',
      type: 'bank_statement',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        bankName: Type.Union([
          Type.Literal('ABC Bank Uganda Limited'),
          Type.Literal('Absa Bank Uganda Limited'),
          Type.Literal('Bank of Africa Uganda Limited'),
          Type.Literal('Bank of Baroda Uganda Limited'),
          Type.Literal('Bank of India Uganda Limited'),
          Type.Literal('Cairo Bank Uganda'),
          Type.Literal('Centenary Bank'),
          Type.Literal('Citibank Uganda'),
          Type.Literal('DFCU Bank'),
          Type.Literal('Diamond Trust Bank'),
          Type.Literal('Ecobank Uganda'),
          Type.Literal('Equity Bank Uganda Limited'),
          Type.Literal('Exim Bank (Uganda)'),
          Type.Literal('Finance Trust Bank'),
          Type.Literal('Guaranty Trust Bank'),
          Type.Literal('Housing Finance Bank'),
          Type.Literal('I&M Bank Uganda'),
          Type.Literal('KCB Bank Uganda Limited'),
          Type.Literal('NCBA Bank Uganda'),
          Type.Literal('Opportunity Bank Uganda Limited'),
          Type.Literal('PostBank Uganda'),
          Type.Literal('Stanbic Bank Uganda Limited'),
          Type.Literal('Standard Chartered Uganda'),
          Type.Literal('Tropical Bank'),
          Type.Literal('United Bank for Africa'),
          Type.Literal('Other'),
        ]),
        printDate: Type.Optional(Type.String({ format: 'date' })),
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        accountHolderName: TypeStringAtLeastOneWord,
        accountNumber: Type.Optional(Type.String()),
      }),
    },
  ];
};
