import { safeEvery, someDocumentDecisionStatus, TDocument } from '@ballerine/common';

export const pickTasksStatus = (documents: Array<TDocument>) => {
  const isApproved = safeEvery(documents, document => document?.decision?.status === 'approved');
  // @ts-expect-error - a document with no decision is a common case.
  const isRejected = someDocumentDecisionStatus(documents, 'rejected');
  // Pending if no decision.
  // @ts-expect-error - a document with no decision is a common case.
  const isPending = someDocumentDecisionStatus(documents, undefined);
  // @ts-expect-error - a document with no decision is a common case.
  const isRevision = someDocumentDecisionStatus(documents, 'revision');

  if (isApproved) return 'approved' as const;
  if (isRejected) return 'rejected' as const;
  if (isPending) return 'pending' as const;
  if (isRevision) return 'revision' as const;

  return 'pending' as const;
};
