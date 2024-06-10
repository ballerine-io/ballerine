import { Meta, StoryObj } from '@storybook/react';
import { NoItems } from './NoItems';
import { NoTasksSvg } from '@/common/components/atoms/icons';

type Story = StoryObj<typeof NoItems>;

export default {
  component: NoItems,
} satisfies Meta<typeof NoItems>;

export const Default = {
  args: {
    resource: 'tasks',
    resourceMissingFrom: 'selected case',
    suggestions: [
      'Make sure to refresh or check back often for new tasks.',
      "Ensure other cases aren't empty as well.",
      'If you suspect a technical issue, reach out to your technical team to diagnose the issue.',
    ],
    illustration: <NoTasksSvg width={80} height={91} />,
  },
} satisfies Story;
