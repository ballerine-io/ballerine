import { Type } from '@sinclair/typebox';

export const CompanySanctionsPluginSchema = Type.Optional(
  Type.Object({
    data: Type.Array(
      Type.Object({
        entity: Type.Object({
          name: Type.String(),
          places: Type.Array(
            Type.Object({
              city: Type.String(),
              type: Type.String(),
              address: Type.String(),
              country: Type.String(),
              location: Type.String(),
            }),
          ),
          sources: Type.Array(
            Type.Object({
              url: Type.String(),
              dates: Type.Array(Type.String()),
              categories: Type.Array(Type.String()),
            }),
          ),
          category: Type.String(),
          countries: Type.Array(Type.String()),
          enterDate: Type.String(),
          categories: Type.Array(Type.String()),
          identities: Type.Array(Type.String()),
          otherNames: Type.Array(
            Type.Object({
              name: Type.String(),
              type: Type.String(),
            }),
          ),
          generalInfo: Type.Object({
            website: Type.String(),
            nationality: Type.String(),
            alternateTitle: Type.String(),
            businessDescription: Type.String(),
          }),
          subcategory: Type.String(),
          descriptions: Type.Array(
            Type.Object({
              description1: Type.String(),
              description2: Type.String(),
              description3: Type.String(),
            }),
          ),
          lastReviewed: Type.String(),
          officialLists: Type.Array(
            Type.Object({
              isCurrent: Type.String(),
              description: Type.String(),
              keyword: Type.String(),
            }),
          ),
          linkedCompanies: Type.Array(
            Type.Object({
              name: Type.String(),
              description: Type.String(),
              categories: Type.Array(Type.String()),
              subcategories: Type.Array(Type.String()),
            }),
          ),
          primaryLocation: Type.String(),
          linkedIndividuals: Type.Array(
            Type.Object({
              firstName: Type.String(),
              middleName: Type.String(),
              lastName: Type.String(),
              description: Type.String(),
              otherCategories: Type.Array(Type.String()),
              subcategories: Type.Array(Type.String()),
            }),
          ),
          furtherInformation: Type.Array(Type.String()),
          originalScriptNames: Type.Array(Type.String()),
        }),
        matchedFields: Type.Array(Type.String()),
      }),
    ),
  }),
);
