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
          PREVIOUS: 'processing_details',
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
        url: `{flowConfig.apiUrl}/api/v1/collection-flow/end-user?token={flowConfig.tokenId}`,
        method: 'POST',
        headers: { Authorization: 'Bearer {flowConfig.tokenId}' },
        stateNames: [],
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              firstName: entity.data.additionalInfo.mainRepresentative.firstName,
              lastName: entity.data.additionalInfo.mainRepresentative.lastName,
              additionalInfo: {title: entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle},
              phone: entity.data.additionalInfo.mainRepresentative.phone,
              dateOfBirth: entity.data.additionalInfo.mainRepresentative.dateOfBirth
              }`,
            },
          ],
        },
      },
      {
        name: 'sync_workflow_runtime',
        pluginKind: 'api',
        url: `{flowConfig.apiUrl}/api/v1/collection-flow/sync/?token={flowConfig.tokenId}`,
        method: 'PUT',
        // stateNames: ['personal_details', 'business_information', 'business_address_information', 'directors_and_ubos', 'contacts_page', 'banking_details', 'store_info', 'website_basic_requirement', 'processing_details', 'company_documents'],
        stateNames: [
          'personal_details',
          'business_information',
          'business_address_information',
          'directors_and_ubos',
          'contacts_page',
          'banking_details',
          'store_info',
          'website_basic_requirement',
          'processing_details',
          'company_documents',
        ],
        headers: { Authorization: 'Bearer {flowConfig.tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              data: {
                context: @,
                endUser: entity.data.additionalInfo.mainRepresentative,
                business: entity.data,
                ballerineEntityId: entity.ballerineEntityId
                }
              }`,
            },
          ],
        },
      },
      {
        name: 'finish_workflow',
        pluginKind: 'api',
        url: `{flowConfig.apiUrl}/api/v1/collection-flow/?token={flowConfig.tokenId}`,
        method: 'PUT',
        stateNames: ['finish'],
        headers: { Authorization: 'Bearer {flowConfig.tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              data: {
                context: @,
                endUser: entity.data.additionalInfo.mainRepresentative,
                business: entity.data,
                ballerineEntityId: entity.ballerineEntityId
                }
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
        headers: { Authorization: 'Bearer {flowConfig.tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              token: flowConfig.tokenId,
              registrationNumber: entity.data.registrationNumber,
              countryCode: entity.data.country,
              state: entity.data.additionalInfo.state || '',
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
        errorAction: 'business_information',
      },
      {
        name: 'send_collection_flow_finished',
        pluginKind: 'api',
        url: `{flowConfig.apiUrl}/api/v1/collection-flow/send-event/?token={flowConfig.tokenId}`,
        method: 'POST',
        stateNames: ['finish'],
        headers: { Authorization: 'Bearer {flowConfig.tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{eventName: 'COLLECTION_FLOW_FINISHED'}`,
            },
          ],
        },
      },
    ],
    commonPlugins: [
      {
        name: 'state_value_removal',
        pluginKind: 'transformer',
        transformers: [
          {
            transformer: 'helpers',
            mapping: [
              {
                method: 'remove',
                source: 'entity.data.additionalInfo.state',
                target: 'entity.data.additionalInfo.state',
              },
            ],
          },
        ],
        stateNames: ['business_information'],
      },
    ],
  },
};
