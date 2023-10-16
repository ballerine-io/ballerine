import { TDocument } from '../types';
import { Type } from '@sinclair/typebox';

export const getUniveralDocuments = (): TDocument[] => {
  const TypeAlphanumericString = Type.String({ pattern: '^[a-zA-Z0-9]*$' });
  const TypePastDate = Type.String({
    format: 'date',
    formatMaximum: new Date().toISOString().split('T')[0],
  });

  return [
    {
      category: 'proof_of_registration',
      type: 'certificate_of_incorporation',
      issuer: { country: 'ZZ' },
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
      type: 'business_registration_certificate',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        registrationNumber: TypeAlphanumericString,
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'financial_information',
      type: 'corporate_tax_certificate',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        taxIdNumber: Type.String(),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_good_standing',
      type: 'certificate_of_good_standing',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_ownership',
      type: 'certificate_of_directors_and_shareholders',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        directors: Type.Array(Type.String()),
        shareholders: Type.Array(Type.String()),
        issueDate: TypePastDate,
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'company_seal',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        imageUrl: Type.String(),
      }),
    },
    {
      category: 'proof_of_domain_ownership',
      type: 'domain_purchase_record',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        domainName: Type.String(),
        ownerName: Type.String(),
        purchaseDate: TypePastDate,
        expiryDate: Type.String({ format: 'date' }),
      }),
    },
    {
      category: 'financial_information',
      type: 'transaction_data_last_3_6_months',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        from: Type.String({ format: 'date' }),
        to: Type.String({ format: 'date' }),
        totalTransactions: Type.Number(),
      }),
    },
    {
      category: 'proof_of_location',
      type: 'front_door_photo',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        imageUrl: Type.String(),
      }),
    },
    {
      category: 'proof_of_location',
      type: 'interior_office_photo',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        imageUrl: Type.String(),
      }),
    },
    {
      category: 'proof_of_business_compliance',
      type: 'permitted_sales_license',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.String(),
        websiteUrl: Type.String(),
        licenseNumber: TypeAlphanumericString,
        issueDate: TypePastDate,
        expiryDate: Type.String({ format: 'date' }),
        permittedProductsOrServices: Type.Array(Type.String()),
      }),
    },
  ];
};
