import { InfoAlert } from './InfoAlert';
import { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof InfoAlert>;

export default {
  component: InfoAlert,
} satisfies Meta<typeof InfoAlert>;

export const Default = {
  args: {
    children: <p>This is an example info message.</p>,
  },
} satisfies Story;
