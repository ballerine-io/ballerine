import { UIRenderer } from '@components/organisms/UIRenderer';
import { UISchema } from '@components/organisms/UIRenderer/types/ui-schema.types';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';

const schema: UISchema = {
  type: 'task',
  options: {},
  elements: [
    {
      type: 'title',
      options: {
        title: 'Im a Heading of root task!',
      },
    },
    {
      type: 'cell',
      options: {
        columns: 3,
      },
      elements: [
        {
          type: 'title',
          options: {
            title: 'Title - 1',
          },
        },
        {
          type: 'title',
          options: {
            title: 'Title - 2',
          },
        },
        {
          type: 'title',
          options: {
            title: 'Title - 3',
          },
        },
        {
          type: 'title',
          options: {
            title: 'Title - 1',
          },
        },
        {
          type: 'title',
          options: {
            title: 'Title - 2',
          },
        },
        {
          type: 'title',
          options: {
            title: 'Title - 3',
          },
        },
        {
          type: 'title',
          options: {
            title: 'Title - 1',
          },
        },
        {
          type: 'title',
          options: {
            title: 'Title - 2',
          },
        },
        {
          type: 'title',
          options: {
            title: 'Title - 3',
          },
        },
      ],
    },
    {
      type: 'task',
      options: {
        variant: 'wrapper',
      },
      elements: [
        {
          type: 'title',
          options: {
            title: 'Some inner content in wrapper-task',
          },
        },
        {
          type: 'cell',
          options: {
            columns: 2,
          },
          elements: [
            {
              type: 'title',
              options: {
                title: 'Nested Title - 1',
              },
            },
            {
              type: 'title',
              options: {
                title: 'Nested Title - 2',
              },
            },
          ],
        },
      ],
    },
  ],
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UIRenderer schema={schema} />
  </React.StrictMode>,
);
