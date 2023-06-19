import Ajv from 'ajv';
const ajv = new Ajv();

export const userRolesValidator = ajv.compile(userRolesSchema);
export const endUserAdditionalInfoValidator = ajv.compile(endUserAdditionalInfoSchema);
export const businessShareholderStructureValidator = ajv.compile(
  businessShareholderStructureSchema,
);
export const businessDocumentsValidator = ajv.compile(businessDocumentsSchema);
export const workflowDefinitionDefinitionValidator = ajv.compile(
  workflowDefinitionDefinitionSchema,
);
export const workflowDefinitionSupportedPlatformsValidator = ajv.compile(
  workflowDefinitionSupportedPlatformsSchema,
);
export const workflowDefinitionExtensionsValidator = ajv.compile(
  workflowDefinitionExtensionsSchema,
);
export const workflowDefinitionBackendValidator = ajv.compile(workflowDefinitionBackendSchema);
export const workflowDefinitionPersistStatesValidator = ajv.compile(
  workflowDefinitionPersistStatesSchema,
);
export const workflowDefinitionSubmitStatesValidator = ajv.compile(
  workflowDefinitionSubmitStatesSchema,
);
export const workflowRuntimeDataContextValidator = ajv.compile(workflowRuntimeDataContextSchema);
export const policyTasksValidator = ajv.compile(policyTasksSchema);
export const policyRulesSetsValidator = ajv.compile(policyRulesSetsSchema);
