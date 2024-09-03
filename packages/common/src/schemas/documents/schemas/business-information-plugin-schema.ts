import { Type } from '@sinclair/typebox';

export const BusinessInformationPluginSchema = Type.Optional(
  Type.Object({
    name: Type.Optional(Type.String()),
    code: Type.Optional(Type.Number()),
    reason: Type.Optional(Type.String()),
    status: Type.Optional(Type.String()),
    message: Type.Optional(Type.String()),
    invokedAt: Type.Optional(Type.Number()),
    jurisdictionCode: Type.Optional(Type.String()),
    data: Type.Optional(
      Type.Union([
        Type.Array(
          Type.Object({
            type: Type.Optional(Type.String()),
            number: Type.Optional(Type.String()),
            shares: Type.Optional(
              Type.Array(
                Type.Object({
                  shareType: Type.Optional(Type.String()),
                  issuedCapital: Type.Optional(Type.String()),
                  paidUpCapital: Type.Optional(Type.String()),
                  shareAllotted: Type.Optional(Type.String()),
                  shareCurrency: Type.Optional(Type.String()),
                }),
              ),
            ),
            status: Type.Optional(Type.String()),
            expiryDate: Type.Optional(Type.String()),
            statusDate: Type.Optional(Type.String()),
            companyName: Type.Optional(Type.String()),
            companyType: Type.Optional(Type.String()),
            lastUpdated: Type.Optional(Type.String()),
            historyNames: Type.Optional(Type.Array(Type.String())),
            businessScope: Type.Optional(
              Type.Object({
                code: Type.Optional(Type.String()),
                description: Type.Optional(Type.String()),
                otherDescription: Type.Optional(Type.String()),
              }),
            ),
            establishDate: Type.Optional(Type.String()),
            lastFinancialDate: Type.Optional(Type.String()),
            registeredAddress: Type.Optional(
              Type.Object({
                postalCode: Type.Optional(Type.String()),
                streetName: Type.Optional(Type.String()),
                unitNumber: Type.Optional(Type.String()),
                levelNumber: Type.Optional(Type.String()),
                buildingName: Type.Optional(Type.String()),
                blockHouseNumber: Type.Optional(Type.String()),
              }),
            ),
            lastAnnualReturnDate: Type.Optional(Type.String()),
            lastAnnualGeneralMeetingDate: Type.Optional(Type.String()),
          }),
        ),
      ]),
    ),
  }),
);
