import { Workflow } from '@app/domains/workflows/types';

export interface Issue {
  name: string;
  reason?: string | null;
  properties?: Record<string, Issue>;
}

export const extractIssuesFromWorkflow = (workflow: Workflow) => {
  const issues: Issue[] = [];

  const isHasDocumentsIssues =
    workflow.context.documents.length &&
    workflow.context.documents.some(document => document.decision.status === 'revision');

  if (isHasDocumentsIssues) {
    const documentTypesToPropertyNamesMap: Record<string, string> = {
      certificate_of_incorporation: 'registrationCertificate',
      utility_bill: 'addressProof',
    };

    const issue: Issue = {
      name: 'documents',
      properties: workflow.context.documents.reduce((documents, document) => {
        const propertyName = documentTypesToPropertyNamesMap[document.type];

        if (!propertyName) return documents;

        documents[propertyName] = {
          name: propertyName,
          reason: document.decision?.revisionReason || null,
        };

        return documents;
      }, {} as Record<string, Issue>),
    };

    issues.push(issue);
  }

  return issues;
};
