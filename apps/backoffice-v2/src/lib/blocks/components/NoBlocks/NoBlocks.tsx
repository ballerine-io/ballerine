import { NoTasksSvg } from '@/common/components/atoms/icons';
import { NoItems } from '@/common/components/molecules/NoItems/NoItems';

export const NoBlocks = () => {
  return (
    <NoItems
      resource={'tasks'}
      resourceMissingFrom={'selected case'}
      suggestions={[
        'Make sure to refresh or check back often for new tasks.',
        "Ensure other cases aren't empty as well.",
        'If you suspect a technical issue, reach out to your technical team to diagnose the issue.',
      ]}
      illustration={<NoTasksSvg width={80} height={91} />}
    />
  );
};
