import { Meta, StoryObj } from '@storybook/react';
import { DownloadFile } from './DownloadFile';

const meta: Meta<typeof DownloadFile> = {
  component: DownloadFile,
};

export default meta;
type Story = StoryObj<typeof DownloadFile>;

export const Default: Story = {
  args: {
    heading: 'Bank statement aug 10 2023.xlsx',
  },
};
