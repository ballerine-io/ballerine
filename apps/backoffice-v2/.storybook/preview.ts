import '@fontsource/inter';
import '../src/index.css';
import type { Preview } from '@storybook/react';
import { withGlobalStyles } from './withGlobalStyles';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withGlobalStyles],
};

export default preview;
