import { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

type Story = StoryObj<typeof Avatar>;

export default {
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export const Default = {
  args: {
    src: 'https://picsum.photos/200',
    placeholder: 'JK',
    className: 'd-8',
  },
} satisfies Story;

export const WithInvalidAvatarUrl = {
  args: {
    src: '',
    className: 'd-8',
  },
} satisfies Story;

export const WithPlaceholder = {
  args: {
    src: '',
    placeholder: 'JK',
    className: 'd-8',
  },
} satisfies Story;
