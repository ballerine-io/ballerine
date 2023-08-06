import { safeEvery, someDocumentDecisionStatus, TDocument } from '@ballerine/common';
import { DocumentDecisionStatus } from '@/workflow/types';

export const computeTasksStatus = (documents: Array<TDocument>) => {
  const isApproved = safeEvery(
    documents,
    document => document?.decision?.status === DocumentDecisionStatus.APPROVED,
  );
  // @ts-expect-error - a document with no decision is a common case.
  const isRejected = someDocumentDecisionStatus(documents, DocumentDecisionStatus.REJECTED);
  // Pending if no decision.
  // @ts-expect-error - a document with no decision is a common case.
  const isPending = someDocumentDecisionStatus(documents, undefined);
  // @ts-expect-error - a document with no decision is a common case.
  const isRevision = someDocumentDecisionStatus(documents, DocumentDecisionStatus.REVISION);

  if (isApproved) return DocumentDecisionStatus.APPROVED;
  if (isRejected) return DocumentDecisionStatus.REJECTED;
  if (isRevision) return DocumentDecisionStatus.REVISION;
  if (isPending) return DocumentDecisionStatus.PENDING;

  return DocumentDecisionStatus.PENDING;
};
