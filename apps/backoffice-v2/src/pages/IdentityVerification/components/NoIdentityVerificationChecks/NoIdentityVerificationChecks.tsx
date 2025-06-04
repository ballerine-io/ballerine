import { NoItems } from '@/common/components/molecules/NoItems/NoItems';
import { NoCasesSvg } from '@/common/components/atoms/icons';

export const NoIdentityVerificationChecks = () => {
  return (
    <NoItems
      resource="Identity Verification reports"
      resourceMissingFrom="system"
      suggestions={[
        'Make sure to refresh or check back often for new Identity Verification reports.',
        "Ensure that your filters aren't too narrow.",
        'If you suspect a technical issue, reach out to your technical team to diagnose the issue.',
      ]}
      illustration={<NoCasesSvg width={96} height={81} />}
    />
  );
};
