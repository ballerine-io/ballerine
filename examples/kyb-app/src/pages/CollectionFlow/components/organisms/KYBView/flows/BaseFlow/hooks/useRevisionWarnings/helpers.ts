import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { InputsWarnings } from '@ballerine/ui';

export const convertWorkflowIssuesToWarnings = (issues: Issue[]): InputsWarnings => {
  return issues.reduce((warnings, issue) => {
    Object.keys(issue.properties).forEach(propertyName => {
      warnings[propertyName] = issue.properties[propertyName].reason;
    });

    return warnings;
  }, {});
};
