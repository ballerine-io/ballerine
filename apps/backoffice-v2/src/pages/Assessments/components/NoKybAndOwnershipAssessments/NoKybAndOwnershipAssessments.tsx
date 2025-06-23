import { NoItems } from '@/common/components/molecules/NoItems/NoItems';
import { NoCasesSvg } from '@/common/components/atoms/icons';

export const NoKybAndOwnershipAssessments = () => {
  return (
    <NoItems
      resource="KYB & Ownership Assessments"
      resourceMissingFrom="system"
      suggestions={[
        'Make sure to refresh or check back often for new KYB & Ownership Assessments.',
        "Ensure that your filters aren't too narrow.",
        'If you suspect a technical issue, reach out to your technical team to diagnose the issue.',
      ]}
      illustration={<NoCasesSvg width={96} height={81} />}
    />
  );
};
