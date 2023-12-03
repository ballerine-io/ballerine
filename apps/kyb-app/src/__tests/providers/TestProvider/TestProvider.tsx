import { Head } from '@/Head';
import { SettingsProvider } from '@/common/providers/SettingsProvider/SettingsProvider';
import { ThemeProvider } from '@/common/providers/ThemeProvider';
import { queryClient } from '@/common/utils/query-client';
import { AnyChildren } from '@ballerine/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import settingsJson from '../../../../settings.json';

interface TestProviderProps {
  children: AnyChildren;
}

export const TestProvider = ({ children }: TestProviderProps) => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Head />
        <SettingsProvider settings={settingsJson}>
          <ThemeProvider theme={settingsJson.theme}>{children}</ThemeProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
