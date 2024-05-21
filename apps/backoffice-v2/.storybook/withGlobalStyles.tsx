import { StoryFn } from '@storybook/react';

export const withGlobalStyles = (Story: StoryFn) => (
  <div style={{ fontFamily: 'Inter, sans-serif' }}>
    <Story />
  </div>
);
