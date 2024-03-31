export const WorkflowDefinitionConfigThemeEnum = {
  KYC: 'kyc',
  KYB: 'kyb',
  DOCUMENTS_REVIEW: 'documents-review',
} as const;

export const WorkflowDefinitionConfigThemes = [
  WorkflowDefinitionConfigThemeEnum.KYB,
  WorkflowDefinitionConfigThemeEnum.KYC,
  WorkflowDefinitionConfigThemeEnum.DOCUMENTS_REVIEW,
] as const;
