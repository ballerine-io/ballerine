import { Workflow } from '@app/domains/workflows/types';
import { Issue } from './types';

export const extractIssuesFromWorkflow = (workflow: Workflow) => {
  const issues: Issue[] = [];

  const isHasDocumentsIssues =
    workflow.context.documents.length &&
    workflow.context.documents.some(document => document.decision?.status === 'revision');

  if (isHasDocumentsIssues) {
    const documentTypesToPropertyNamesMap: Record<string, string> = {
      certificate_of_incorporation: 'registrationCertificate',
      water_bill: 'addressProof',
      shareholders: 'companyStructure',
      bank_statement: 'bankStatement',
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
