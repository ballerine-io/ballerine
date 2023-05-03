export const userRolesSchema = {
  type: 'array',
  items: {
    type: 'string',
  },
};

export const endUserAdditionalInfoSchema = {
  type: 'object',
  properties: {
    // Define your additional info properties here
  },
  additionalProperties: false,
};

export const businessShareholderStructureSchema = {
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

export const businessDocumentsSchema = {
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

export const workflowDefinitionDefinitionSchema = {
  type: 'object',
  properties: {
    // Define your workflow definition properties here
  },
  additionalProperties: false,
};

export const workflowDefinitionSupportedPlatformsSchema = {
  type: 'object',
  properties: {
    // Define your supported platforms properties here
  },
  additionalProperties: false,
};

export const workflowDefinitionExtensionsSchema = {
  type: 'object',
  properties: {
    // Define your extensions properties here
  },
  additionalProperties: false,
};

export const workflowDefinitionBackendSchema = {
  type: 'object',
  properties: {
    // Define your backend properties here
  },
  additionalProperties: false,
};

export const workflowDefinitionPersistStatesSchema = {
  type: 'object',
  properties: {
    // Define your persist states properties here
  },
  additionalProperties: false,
};

export const workflowDefinitionSubmitStatesSchema = {
  type: 'object',
  properties: {
    // Define your submit states properties here
  },
  additionalProperties: false,
};

export const workflowRuntimeDataContextSchema = {
  type: 'object',
  properties: {
    // Define your workflow runtime data context properties here
  },
  additionalProperties: false,
};

export * from './policies';
