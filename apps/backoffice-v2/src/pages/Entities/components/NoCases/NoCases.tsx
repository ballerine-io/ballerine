import { FunctionComponent } from 'react';
import { NoCasesSvg } from '@/common/components/atoms/icons';
import { NoItems } from '@/common/components/molecules/NoItems/NoItems';

export const NoCases: FunctionComponent = () => {
  return (
    <NoItems
      resource={'cases'}
      resourceMissingFrom={'queue'}
      suggestions={[
        'Make sure to refresh or check back often for new cases.',
        "Ensure that your filters aren't too narrow.",
        'If you suspect a technical issue, reach out to your technical team to diagnose the issue.',
      ]}
      illustration={<NoCasesSvg width={96} height={81} />}
    />
  );
};
