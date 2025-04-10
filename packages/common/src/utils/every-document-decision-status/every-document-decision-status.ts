import { safeEvery } from '../safe-every/safe-every';

export const everyDocumentDecisionStatus = <
  TItem extends {
    decision: {
      status: 'approved' | 'rejected' | 'revision';
    };
  },
>(
  documents: TItem[],
  status: string,
) => {
  return safeEvery(documents, document => document?.decision?.status === status);
};
