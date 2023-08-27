export const someDocumentDecisionStatus = <
  TItem extends {
    decision: {
      status: 'approved' | 'rejected' | 'revision';
    };
  },
>(
  documents: Array<TItem>,
  status: string,
) => {
  return documents?.some(document => document?.decision?.status === status);
};
