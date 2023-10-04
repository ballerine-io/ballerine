import type { Meta, StoryObj } from '@storybook/react';
import { TableCell } from './TableCell';

const meta = {
  component: TableCell,
} satisfies Meta<typeof TableCell>;

export default meta;

type Story = StoryObj<typeof TableCell>;

export const Default = {
  args: {
    value: {
      columns: [
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'name',
          header: 'Name',
        },
      ],
      data: [
        {
          id: 1,
          name: 'John',
        },
        {
          id: 2,
          name: 'Jane',
        },
      ],
    },
  },
} satisfies Story;

export const WithCaption = {
  args: {
    value: {
      caption: 'Caption',
      columns: [
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'name',
          header: 'Name',
        },
      ],
      data: [
        {
          id: 1,
          name: 'John',
        },
        {
          id: 2,
          name: 'Jane',
        },
      ],
    },
  },
} satisfies Story;

export const WithNoData = {
  args: {
    value: {
      caption: 'Caption',
      columns: [
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'name',
          header: 'Name',
        },
      ],
      data: [],
    },
  },
} satisfies Story;

export const WithNoColumns = {
  args: {
    value: {
      caption: 'Caption',
      columns: [],
      data: [
        {
          id: 1,
          name: 'John',
        },
        {
          id: 2,
          name: 'Jane',
        },
      ],
    },
  },
} satisfies Story;

export const WithCustomCells = {
  args: {
    value: {
      caption: 'Caption',
      columns: [
        {
          accessorKey: 'url',
          header: 'URL',
        },
      ],
      data: [
        {
          url: 'https://www.google.com',
        },
      ],
    },
  },
} satisfies Story;
