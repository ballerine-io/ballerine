export const defintion = {
  id: 'dynamic_collection_flow',
  predictableActionArguments: true,
  initial: 'personal_details',
  context: {},
  states: {
    personal_details: {
      on: {
        next: 'business_information',
      },
    },
    business_information: {
      on: {
        next: 'business_address_information',
        previous: 'personal_details',
      },
    },
    business_address_information: {
      on: {
        previous: 'business_information',
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'update_end_user',
        pluginKind: 'api',
        url: `{VITE_API_URL}/api/v1/collection-flow/end-user`,
        method: 'POST',
        headers: { Authorization: 'Bearer {tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              firstName: entity.data.additionalInfo.mainRepresentative.countryOfIncorporation,
              lastName: entity.data.additionalInfo.mainRepresentative.registrationNumber,
              additionalInfo: {title: entity.data.additionalInfo.mainRepresentative.additionalInfo.title},
              phone: entity.data.additionalInfo.mainRepresentative.phone,
              dateOfBirth: entity.data.additionalInfo.mainRepresentative.dateOfBirth
              }`,
            },
          ],
        },
      },
      {
        name: 'update_runtime_data',
        pluginKind: 'api',
        url: `{VITE_API_URL}/api/v1/collection-flow/{tokenId}`,
        method: 'PUT',
        stateNames: ['company_information', 'address_information'],
        headers: { Authorization: 'Bearer {tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              flowId: {tokenId},
              mainRepresentative: entity.data.additionalInfo.mainRepresentative,
              documents: documents,
              ubos: entity.data.additionalInfo.ubos,
              businessData: entity.data,
              }`,
            },
          ],
        },
      },
    ],
  },
};
