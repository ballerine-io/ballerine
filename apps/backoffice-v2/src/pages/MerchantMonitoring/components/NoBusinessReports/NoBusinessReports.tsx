import { NoItems } from '@/common/components/molecules/NoItems/NoItems';
import { NoCasesSvg } from '@/common/components/atoms/icons';
import React from 'react';

export const NoBusinessReports = () => {
  return (
    <NoItems
      resource="reports"
      resourceMissingFrom="system"
      suggestions={[
        'Make sure to refresh or check back often for new reports.',
        "Ensure that your filters aren't too narrow.",
        'If you suspect a technical issue, reach out to your technical team to diagnose the issue.',
      ]}
      illustration={<NoCasesSvg width={96} height={81} />}
    />
  );
};
