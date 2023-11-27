import { Meta, StoryObj } from '@storybook/react';
import { DownloadFile } from './DownloadFile';

const meta: Meta<typeof DownloadFile> = {
  component: DownloadFile,
};

export default meta;
type Story = StoryObj<typeof DownloadFile>;

export const Default: Story = {
  args: {
    value: {
      href: 'https://picsum.photos/200',
      heading: 'Bank statement aug 10 2023.xlsx',
      callToAction: 'Download',
    },
  },
};
