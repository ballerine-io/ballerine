import { ProcessStatus, UnifiedApiReasons } from '@ballerine/common';

export const KYC_DONE_RULE = (definitionId = 'kyc_email_session_example') => {
  return `(childWorkflows.${definitionId}.*.[result.vendorResult.decision] != null && length(childWorkflows.${definitionId}.*.[result.vendorResult.decision][]) == length(childWorkflows.${definitionId}.*[]) && length(childWorkflows.${definitionId}.* | [?state == 'revision']) == \`0\`)`;
};

export const CHILD_KYB_DONE_RULE = (definitionId: string): string => {
  return `(childWorkflows.${definitionId} == null || length(childWorkflows.${definitionId}) == \`0\` || length(childWorkflows.${definitionId}.*.state[?@ == 'idle' || @ == 'manual_review']) == length(childWorkflows.${definitionId}.*))`;
};

export const UnifiedApiReasonsString = `[${UnifiedApiReasons.map(reason => `'${reason}'`).join(
  ', ',
)}]`;

export const BUSINESS_INFORMATION_DONE = `(
  pluginsOutput.businessInformation.data ||
  contains(${UnifiedApiReasonsString}, pluginsOutput.businessInformation.reason)
)`;

export const UBO_DONE = `(
  pluginsOutput.ubo.data ||
  contains(${UnifiedApiReasonsString}, pluginsOutput.ubo.reason)
)`;

const UnifiedApiStatuses = [ProcessStatus.SUCCESS, ProcessStatus.CANCELED, ProcessStatus.ERROR];

const UnifiedApiStatusesString = `[${UnifiedApiStatuses.map(status => `'${status}'`).join(', ')}]`;

export const BANK_ACCOUNT_VERIFICATION_DONE = `contains(${UnifiedApiStatusesString}, pluginsOutput.bankAccountVerification.status)`;

export const COMMERCIAL_CREDIT_CHECK_DONE = `contains(${UnifiedApiStatusesString}, pluginsOutput.commercialCreditCheck.status)`;

export const SANCTIONS_DONE = `pluginsOutput.companySanctions.data != null`;

export const HAS_COMPANY_SANCTIONS_CATEGORIES = {
  key: 'pluginsOutput.companySanctions.data',
  operator: 'COMPANY_SANCTIONS_CATEGORIES',
  value: { threshold: 1, category: 'Adverse Media' },
};

export const BUSINESS_UBO_AND_SANCTIONS_DONE = `
  ${BUSINESS_INFORMATION_DONE} &&
  ${UBO_DONE} &&
  ${SANCTIONS_DONE}
`;

export const BUSINESS_INFORMATION_DONE_OR_ERRORED = `
(
  (
    pluginsOutput.businessInformation.data ||
    pluginsOutput.businessInformation.error != null
  ) ||
  contains(${UnifiedApiReasonsString}, pluginsOutput.businessInformation.reason)
)`;

export const UBO_DONE_OR_ERRORED = `
(
  (
    pluginsOutput.ubo.data ||
    pluginsOutput.ubo.error != null
  ) ||
  contains(${UnifiedApiReasonsString}, pluginsOutput.ubo.reason)
)`;

export const BUSINESS_UBO_AND_SANCTIONS_DONE_OR_ERRORED = `
  ${BUSINESS_INFORMATION_DONE_OR_ERRORED} &&
  ${UBO_DONE_OR_ERRORED} &&
  ${SANCTIONS_DONE}
`;

export const MERCHANT_SCREENING_DONE_OR_ERRORED = `
  (
    (
      pluginsOutput.merchantScreening.raw != null && pluginsOutput.merchantScreening.processed != null ||
      pluginsOutput.merchantScreening.error != null
    ) ||
    contains(${UnifiedApiReasonsString}, pluginsOutput.merchantScreening.reason)
  )
`;

export const WEBSITE_ANALYSIS_DONE = `pluginsOutput.merchantMonitoring.data != null`;

export const kycAndVendorDone = {
  target: 'manual_review',
  cond: {
    type: 'jmespath',
    options: {
      rule: `${KYC_DONE_RULE()} && ${BUSINESS_UBO_AND_SANCTIONS_DONE_OR_ERRORED} && ${WEBSITE_ANALYSIS_DONE}`,
    },
  },
};
