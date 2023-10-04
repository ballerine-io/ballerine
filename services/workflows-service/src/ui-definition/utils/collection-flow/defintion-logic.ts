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
          NEXT: 'business_information',
        },
      },
      business_information: {
        on: {
          NEXT: 'business_address_information',
          PREVIOUS: 'personal_details',
        },
      },
      business_address_information: {
        on: {
          NEXT: 'directors_and_ubos',
          PREVIOUS: 'business_information',
        },
      },
      directors_and_ubos: {
        on: {
          NEXT: 'contacts_page',
          PREVIOUS: 'business_address_information',
        },
      },
      contacts_page: {
        on: {
          NEXT: 'banking_details',
          PREVIOUS: 'directors_and_ubos',
        },
      },
      banking_details: {
        on: {
          NEXT: 'store_info',
          PREVIOUS: 'contacts_page',
        },
      },
      store_info: {
        on: {
          NEXT: 'website_basic_requirement',
          PREVIOUS: 'banking_details',
        },
      },
      website_basic_requirement: {
        on: {
          NEXT: 'processing_details',
          PREVIOUS: 'store_info',
        },
      },
      processing_details: {
        on: {
          NEXT: 'company_documents',
          PREVIOUS: 'website_basic_requirement',
        },
      },
      company_documents: {
        on: {
          NEXT: 'finish',
          PREVIOUS: 'website_basic_requirement',
        },
      },
      finish: { type: 'final' },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'update_end_user',
        pluginKind: 'api',
        url: `{flowConfig.apiUrl}/api/v1/collection-flow/end-user?toke={tokenId}`,
        method: 'POST',
        headers: { Authorization: 'Bearer {tokenId}' },
        stateNames: [],
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
        url: `{flowConfig.apiUrl}/api/v1/collection-flow/{tokenId}`,
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
        url: `{flowConfig.apiUrl}/api/v1/collection-flow/business/business-information`,
        method: 'GET',
        stateNames: [],
        headers: { Authorization: 'Bearer {tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              token: tokenId,
              registrationNumber: entity.data.registrationNumber,
              jurisdictionCode: entity.data.country,
              vendor: 'open-corporates'
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              companyName: name,
              taxIdentificationNumber: vat,
              numberOfEmployees: numberOfEmployees,
              businessType: companyType,
              additionalInfo: {openCorporate: @}
              }`,
            },
          ],
        },
        persistResponseDestination: 'entity.data',
        successAction: 'business_information',
        errorAction: 'business_information'
      },
    ],
  },
};
