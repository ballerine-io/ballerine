import { convertWorkflowIssuesToWarnings } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useRevisionWarnings/helpers';
import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { InputsWarnings } from '@ballerine/ui';
import { useMemo } from 'react';

export const useRevisionWarnings = (issues: Issue[]): InputsWarnings => {
  const warnings = useMemo(() => convertWorkflowIssuesToWarnings(issues), [issues]);

  return warnings;
};
