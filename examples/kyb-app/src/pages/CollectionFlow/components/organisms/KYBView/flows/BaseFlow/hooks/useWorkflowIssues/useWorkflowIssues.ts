import { Workflow } from '@app/domains/workflows/types';
import { extractIssuesFromWorkflow } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues/helpers';
import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues/types';
import { useMemo } from 'react';

export const useWorkflowIssues = (workflow: Workflow): Issue[] => {
  const issues = useMemo(() => {
    if (!workflow) return [];

    return extractIssuesFromWorkflow(workflow);
  }, [workflow]);

  return issues;
};
