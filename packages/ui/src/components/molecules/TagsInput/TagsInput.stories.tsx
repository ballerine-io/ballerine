import type { Meta, StoryObj } from '@storybook/react';
import { TagsInput } from './TagsInput';

const meta = {
  component: TagsInput,
} satisfies Meta<typeof TagsInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: ['tag1', 'tag2', 'tag3'],
    placeholder: 'Add tags...',
  },
};

export const Empty: Story = {
  args: {
    value: [],
    placeholder: 'Add tags...',
  },
};

export const WithCustomStyles: Story = {
  args: {
    value: ['custom', 'styled', 'tags'],
    placeholder: 'Add tags...',
    styleClasses: {
      container: 'border-2 border-blue-500 rounded-lg p-2',
      tag: 'bg-blue-100 text-blue-800',
      tagText: 'font-semibold',
      removeButton: 'text-blue-500 hover:text-blue-700',
    },
  },
};

export const ReadOnly: Story = {
  args: {
    value: ['readonly', 'tags'],
    placeholder: 'Add tags...',
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    value: ['disabled', 'tags'],
    placeholder: 'Add tags...',
    disabled: true,
  },
};
