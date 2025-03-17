import { Type } from '@sinclair/typebox';

export const IndividualDataSchema = Type.Object({
  isContactPerson: Type.Optional(Type.Boolean()),
  correlationId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  endUserType: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  email: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  phone: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  country: Type.Optional(
    Type.Union([Type.String({ description: 'ISO 3166-1 alpha-2 country code' }), Type.Null()]),
  ),
  dateOfBirth: Type.Optional(
    Type.Union([Type.String({ format: 'date' }), Type.String(), Type.Null()]),
  ),
  avatarUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  nationalId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  additionalInfo: Type.Optional(Type.Union([Type.Object({}), Type.Null()])),
});

export const BusinessDataSchema = Type.Object({
  correlationId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  businessType: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  companyName: Type.String({ minLength: 2, maxLength: 100 }),
  registrationNumber: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  legalForm: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  country: Type.Optional(
    Type.Union([Type.String({ description: 'ISO 3166-1 alpha-2 country code' }), Type.Null()]),
  ),
  countryOfIncorporation: Type.Optional(
    Type.Union([Type.String({ description: 'ISO 3166-1 alpha-2 country code' }), Type.Null()]),
  ),
  dateOfIncorporation: Type.Optional(
    Type.Union([Type.String({ format: 'date' }), Type.String(), Type.Null()]),
  ),
  address: Type.Optional(Type.Union([Type.Object({}), Type.Null()])),
  phoneNumber: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  email: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  website: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  industry: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  taxIdentificationNumber: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  vatNumber: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  shareholderStructure: Type.Optional(Type.Union([Type.Object({}), Type.Null()])),
  numberOfEmployees: Type.Optional(Type.Number()),
  businessPurpose: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  avatarUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  additionalInfo: Type.Optional(
    Type.Union([
      Type.Object(
        {
          mainRepresentative: Type.Optional(
            Type.Object({
              email: Type.Optional(Type.String()),
              lastName: Type.Optional(Type.String()),
              firstName: Type.Optional(Type.String()),
            }),
          ),
        },
        { additionalProperties: true },
      ),
      Type.Null(),
    ]),
  ),
  bankInformation: Type.Optional(Type.Union([Type.Object({}), Type.Null()])),
  mccCode: Type.Optional(Type.Number()),
  metadata: Type.Optional(Type.Union([Type.Object({}), Type.Null()])),
});

export const EntitySchema = Type.Object(
  {
    type: Type.String({ enum: ['individual', 'business'] }),
    data: Type.Union([IndividualDataSchema, BusinessDataSchema]),
  },
  { additionalProperties: false },
);
