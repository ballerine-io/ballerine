import { TDocument } from '@/schemas';
import { Type } from '@sinclair/typebox';

export const getUgandaDocuments = (): TDocument[] => {
  const TypeAlphanumericString = Type.String({ pattern: '^[a-zA-Z0-9]*$' });
  const TypePastDate = Type.String({
    format: 'date',
    formatMaximum: new Date().toISOString().split('T')[0],
  });
  const TypeStringEnum = <T extends string[]>(values: [...T]) =>
    Type.Unsafe<T[number]>({
      type: 'string',
      enum: values,
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
        issuer: TypeStringEnum(['KCCA', 'Other']),
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
        bankName: TypeStringEnum([
          'ABC Bank Uganda Limited',
          'Absa Bank Uganda Limited',
          'Bank of Africa Uganda Limited',
          'Bank of Baroda Uganda Limited',
          'Bank of India Uganda Limited',
          'Cairo Bank Uganda',
          'Centenary Bank',
          'Citibank Uganda',
          'DFCU Bank',
          'Diamond Trust Bank',
          'Ecobank Uganda',
          'Equity Bank Uganda Limited',
          'Exim Bank (Uganda)',
          'Finance Trust Bank',
          'Guaranty Trust Bank',
          'Housing Finance Bank',
          'I&M Bank Uganda',
          'KCB Bank Uganda Limited',
          'NCBA Bank Uganda',
          'Opportunity Bank Uganda Limited',
          'PostBank Uganda',
          'Stanbic Bank Uganda Limited',
          'Standard Chartered Uganda',
          'Tropical Bank',
          'United Bank for Africa',
          'Other',
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
