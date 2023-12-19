export const definition = {
  definitionType: 'statechart-json',
  definition: {
    id: 'dynamic_collection_flow',
    predictableActionArguments: true,
    initial: 'company_information',
    context: {},
    states: {
      company_information: {
        on: {
          NEXT: 'business_address_information',
        },
      },
      business_address_information: {
        on: {
          NEXT: 'company_documents',
          PREVIOUS: 'company_information',
        },
      },
      company_documents: {
        on: {
          NEXT: 'finish',
          PREVIOUS: 'business_address_information',
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
        stateNames: [
          'personal_details',
          'company_information',
          'business_address_information',
          'company_activity',
          'bank_information',
          'company_ownership',
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
        successAction: 'company_information',
        errorAction: 'company_information',
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
  },
};
