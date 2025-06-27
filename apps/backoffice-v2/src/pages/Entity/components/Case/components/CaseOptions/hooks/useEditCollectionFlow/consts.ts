import { TSteps } from './useEditCollectionFlow';

export const EDIT_TEMPLATES = {
  ALL: 'all',
  COMPANY_DETAILS: ['company_details'],
  COMPANY_OWNERSHIP: ['company_ownership'],
} satisfies Record<string, TSteps>;
