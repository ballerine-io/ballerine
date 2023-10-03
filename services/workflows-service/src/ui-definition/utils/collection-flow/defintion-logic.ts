export const definition = {
  definitionType: 'statechart-json',
  definition: {
    id: 'dynamic_collection_flow',
    predictableActionArguments: true,
    initial: 'personal_details',
    context: {},
    states: {
      personal_details: {
        on: {
          next: 'company_information',
        },
      },
      company_information: {
        on: {
          next: 'business_address_information',
          previous: 'personal_details',
        },
      },
      business_address_information: {
        on: {
          next: 'directors_and_ubos',
          previous: 'company_information',
        },
      },
      directors_and_ubos: {
        on: {
          next: 'contacts_page',
          previous: 'business_address_information',
        },
      },
      contacts_page: {
        on: {
          next: 'banking_details',
          previous: 'directors_and_ubos',
        },
      },
      banking_details: {
        on: {
          next: 'store_info',
          previous: 'contacts_page',
        },
      },
      store_info: {
        on: {
          next: 'website_basic_requirement',
          previous: 'banking_details',
        },
      },
      website_basic_requirement: {
        on: {
          next: 'processing_details',
          previous: 'store_info',
        },
      },
      processing_details: {
        on: {
          next: 'website_basic_requirement',
          previous: 'website_basic_requirement',
        },
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
      {
        name: 'fetch_company_information',
        pluginKind: 'api',
        url: `{VITE_API_URL}/api/v1/collection-flow/business/business-information`,
        method: 'GET',
        headers: { Authorization: 'Bearer {tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              registrationNumber: context.entity.data.registrationNumber,
              jurisdictionCode: context.entity.data.country,
              vendor: 'open-corporates'
              }`,
            },
          ],
        },
      },
    ],
  },
};
