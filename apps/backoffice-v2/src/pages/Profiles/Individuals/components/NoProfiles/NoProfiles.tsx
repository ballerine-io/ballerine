import { NoCasesSvg } from '@/common/components/atoms/icons';
import { FunctionComponent } from 'react';
import { NoItems } from '@/common/components/molecules/NoItems/NoItems';

export const NoProfiles: FunctionComponent = () => {
  return (
    <NoItems
      resource={'profiles'}
      resourceMissingFrom={'system'}
      suggestions={[
        'Make sure to refresh or check back often for new profiles.',
        "Ensure that your filters aren't too narrow.",
        'If you suspect a technical issue, reach out to your technical team to diagnose the issue.',
      ]}
      illustration={<NoCasesSvg width={96} height={81} />}
    />
  );
};
