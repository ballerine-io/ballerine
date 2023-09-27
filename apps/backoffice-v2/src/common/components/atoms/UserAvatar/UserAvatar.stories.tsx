import { Meta, StoryObj } from '@storybook/react';
import { UserAvatar } from './UserAvatar';

type Story = StoryObj<typeof UserAvatar>;

export default {
  component: UserAvatar,
} satisfies Meta<typeof UserAvatar>;

export const Default = {
  args: {
    fullName: 'Full Name',
    avatarUrl: 'https://picsum.photos/200',
  },
} satisfies Story;

export const WithInvalidAvatarUrl = {
  args: {
    fullName: 'Full Name',
    avatarUrl: '',
  },
} satisfies Story;

export const WithPlaceholder = {
  args: {
    fullName: 'Full Name',
    avatarUrl: null,
  },
} satisfies Story;
