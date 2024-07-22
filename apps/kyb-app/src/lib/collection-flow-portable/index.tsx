import { SettingsProvider } from '@/common/providers/SettingsProvider/SettingsProvider';
import { ThemeProvider } from '@/common/providers/ThemeProvider';
import { queryClient } from '@/common/utils/query-client';
import { Head } from '@/Head';
import {
  CollectionFlowPortable,
  ICollectionFlowPortableProps,
} from '@/lib/collection-flow-portable/CollectionFlowPortable';
import { QueryClientProvider } from '@tanstack/react-query';
import { FunctionComponent } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import settingsJson from '../../../settings.json';

export const Main: FunctionComponent<ICollectionFlowPortableProps> = props => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Head />
        <SettingsProvider settings={settingsJson}>
          <ThemeProvider theme={settingsJson.theme}>
            <CollectionFlowPortable {...props} />
          </ThemeProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};
