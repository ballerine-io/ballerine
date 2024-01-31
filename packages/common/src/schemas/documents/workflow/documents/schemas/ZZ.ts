import { Type } from '@sinclair/typebox';
import { TDocument } from '../types';

export const getUniversalDocuments = (): TDocument[] => {
  const OptionalTypeAlphanumericString = Type.Optional(Type.String({ pattern: '^[a-zA-Z0-9]*$' }));
  const OptionalTypePastDate = Type.Optional(
    Type.String({
      format: 'date',
      formatMaximum: new Date().toISOString().split('T')[0],
    }),
  );

  return [
    {
      category: 'proof_of_registration',
      type: 'certificate_of_incorporation',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        registrationNumber: OptionalTypeAlphanumericString,
        issueDate: OptionalTypePastDate,
      }),
    },
    {
      category: 'proof_of_registration',
      type: 'business_registration_certificate',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        registrationNumber: OptionalTypeAlphanumericString,
        issueDate: OptionalTypePastDate,
      }),
    },
    {
      category: 'financial_information',
      type: 'corporate_tax_certificate',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        taxIdNumber: Type.Optional(Type.String()),
        issueDate: OptionalTypePastDate,
      }),
    },
    {
      category: 'proof_of_good_standing',
      type: 'certificate_of_good_standing',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        issueDate: OptionalTypePastDate,
      }),
    },
    {
      category: 'proof_of_ownership',
      type: 'certificate_of_directors_and_shareholders',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        directors: Type.Optional(Type.String()),
        shareholders: Type.Optional(Type.String()),
        issueDate: OptionalTypePastDate,
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'company_seal',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_domain_ownership',
      type: 'domain_purchase_record',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        domainName: Type.Optional(Type.String()),
        ownerName: Type.Optional(Type.String()),
        purchaseDate: OptionalTypePastDate,
        expiryDate: Type.Optional(Type.String({ format: 'date' })),
      }),
    },
    {
      category: 'financial_information',
      type: 'transaction_data_last_3_6_months',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        from: Type.Optional(Type.String({ format: 'date' })),
        to: Type.Optional(Type.String({ format: 'date' })),
        totalTransactions: Type.Optional(Type.Number()),
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
    {
      category: 'proof_of_business_compliance',
      type: 'permitted_sales_license',
      issuer: { country: 'UG' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        businessName: Type.Optional(Type.String()),
        websiteUrl: Type.Optional(Type.String()),
        licenseNumber: OptionalTypeAlphanumericString,
        issueDate: OptionalTypePastDate,
        expiryDate: Type.Optional(Type.String({ format: 'date' })),
        permittedProductsOrServices: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'passport',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        documentNumber: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'national_id',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        documentNumber: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'driver_licence',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        documentNumber: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_identity',
      type: 'resident_card',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        documentNumber: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_identity_ownership',
      type: 'selfie',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: Type.Object({
        documentNumber: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
      }),
    },
    {
      category: 'proof_of_bank_account_ownership',
      type: 'general_document',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {},
    },
    {
      category: 'general_documents',
      type: 'supplementary_document',
      issuer: { country: 'ZZ' },
      issuingVersion: 1,
      version: 1,
      propertiesSchema: {},
    },
  ];
};
