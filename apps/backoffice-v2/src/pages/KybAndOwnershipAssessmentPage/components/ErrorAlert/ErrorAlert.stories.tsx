import { ErrorAlert } from './ErrorAlert';
import { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof ErrorAlert>;

export default {
  component: ErrorAlert,
} satisfies Meta<typeof ErrorAlert>;

export const Default = {
  args: {
    children: <p>This is an example error message.</p>,
  },
} satisfies Story;
