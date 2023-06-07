const userRolesSchema = {
  type: 'array',
  items: {
    type: 'string',
  },
};

const endUserAdditionalInfoSchema = {
  type: 'object',
  properties: {
    // Define your additional info properties here
  },
  additionalProperties: false,
};

const businessShareholderStructureSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      ownershipPercentage: { type: 'number' },
    },
    required: ['name', 'ownershipPercentage'],
    additionalProperties: false,
  },
};

const businessDocumentsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      documentType: { type: 'string' },
      fileUrl: { type: 'string' },
    },
    required: ['documentType', 'fileUrl'],
    additionalProperties: false,
  },
};

const workflowDefinitionDefinitionSchema = {
  type: 'object',
  properties: {
    // Define your workflow definition properties here
  },
  additionalProperties: false,
};

const workflowDefinitionSupportedPlatformsSchema = {
  type: 'object',
  properties: {
    // Define your supported platforms properties here
  },
  additionalProperties: false,
};

const workflowDefinitionExtensionsSchema = {
  type: 'object',
  properties: {
    // Define your extensions properties here
  },
  additionalProperties: false,
};

const workflowDefinitionBackendSchema = {
  type: 'object',
  properties: {
    // Define your backend properties here
  },
  additionalProperties: false,
};

const workflowDefinitionPersistStatesSchema = {
  type: 'object',
  properties: {
    // Define your persist states properties here
  },
  additionalProperties: false,
};

const workflowDefinitionSubmitStatesSchema = {
  type: 'object',
  properties: {
    // Define your submit states properties here
  },
  additionalProperties: false,
};

const workflowRuntimeDataContextSchema = {
  type: 'object',
  properties: {
    // Define your workflow runtime data context properties here
  },
  additionalProperties: false,
};

const policyTasksSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      taskName: { type: 'string' },
      // Define other task properties here
    },
    required: ['taskName'],
    additionalProperties: false,
  },
};

const policyRulesSetsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      rules: { type: 'array' },
      result: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          score: { type: 'string' },
        },
        required: ['status', 'riskScore'],
        additionalProperties: false,
      },
    },
    required: ['rules', 'result'],
    additionalProperties: false,
  },
};
