export const putPluginsExampleResponse = {
  apiPlugins: [
    {
      name: 'company-sanctions',
      vendor: 'asia-verify',
      pluginKind: 'company-sanctions',
      stateNames: ['run_vendor_data'],
      displayName: 'Company Sanctions',
      errorAction: 'VENDOR_FAILED',
      successAction: 'VENDOR_DONE',
    },
    {
      name: 'kyb',
      vendor: 'asia-verify',
      pluginKind: 'registry-information',
      stateNames: ['get_vendor_data'],
      displayName: 'Registry Information',
      errorAction: 'VENDOR_FAILED',
      successAction: 'VENDOR_DONE',
    },
    {
      name: 'company-sanctions',
      vendor: 'asia-verify',
      pluginKind: 'company-sanctions',
      stateNames: ['get_vendor_data'],
      displayName: 'Company Sanctions',
      errorAction: 'VENDOR_FAILED',
      successAction: 'VENDOR_DONE',
    },
    {
      name: 'ubo',
      vendor: 'asia-verify',
      pluginKind: 'ubo',
      stateNames: ['get_vendor_data'],
      displayName: 'UBO Check',
      errorAction: 'VENDOR_FAILED',
      successAction: 'VENDOR_DONE',
    },
    {
      name: 'resubmission-email',
      pluginKind: 'resubmission-email',
      stateNames: ['pending_resubmission'],
      errorAction: 'EMAIL_FAILURE',
      successAction: 'EMAIL_SENT',
    },
  ],
  commonPlugins: [
    {
      name: 'risk_evaluation',
      pluginKind: 'riskRules',
      stateNames: ['manual_review'],
      rulesSource: {
        source: 'notion',
        databaseId: 'aaaaaaaaaaaaaa',
      },
    },
  ],
  childWorkflowPlugins: [],
  dispatchEventPlugins: [],
};
