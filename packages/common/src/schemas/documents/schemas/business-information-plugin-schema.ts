import { Type } from '@sinclair/typebox';

export const BusinessInformationPluginSchema = Type.Object({
  name: Type.String(),
  code: Type.Optional(Type.Number()),
  reason: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  invokedAt: Type.Optional(Type.Number()),
  jurisdictionCode: Type.Optional(Type.Number()),
  data: Type.Union([
    Type.Array(
      Type.Object({
        type: Type.String(),
        number: Type.String(),
        shares: Type.Array(
          Type.Object({
            shareType: Type.String(),
            issuedCapital: Type.String(),
            paidUpCapital: Type.String(),
            shareAllotted: Type.String(),
            shareCurrency: Type.String(),
          }),
        ),
        status: Type.String(),
        expiryDate: Type.String(),
        statusDate: Type.String(),
        companyName: Type.String(),
        companyType: Type.String(),
        lastUpdated: Type.String(),
        historyNames: Type.Array(Type.String()),
        businessScope: Type.Object({
          code: Type.String(),
          description: Type.String(),
          otherDescription: Type.String(),
        }),
        establishDate: Type.String(),
        lastFinancialDate: Type.String(),
        registeredAddress: Type.Object({
          postalCode: Type.String(),
          streetName: Type.String(),
          unitNumber: Type.String(),
          levelNumber: Type.String(),
          buildingName: Type.String(),
          blockHouseNumber: Type.String(),
        }),
        lastAnnualReturnDate: Type.String(),
        lastAnnualGeneralMeetingDate: Type.String(),
      }),
    ),
  ]),
});
