import { Image } from './Image';
import { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Image>;

export default {
  component: Image,
} satisfies Meta<typeof Image>;

export const Default = {
  args: {
    src: 'https://picsum.photos/150',
    alt: 'Placeholder',
    width: '150px',
    height: '150px',
  },
} satisfies Story;
