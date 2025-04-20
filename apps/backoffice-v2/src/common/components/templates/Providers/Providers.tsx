import { QueryClientProvider } from '@tanstack/react-query';
import { FunctionComponent, PropsWithChildren } from 'react';
import { TooltipProvider } from '@ballerine/ui';
import { PostHogProvider } from 'posthog-js/react';

import { queryClient } from '@/lib/react-query/query-client';
import { AuthProvider } from '@/domains/auth/context/AuthProvider/AuthProvider';
import { env } from '@/common/env/env';

export const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <PostHogProvider
      apiKey={env.VITE_POSTHOG_KEY ?? ''}
      options={{
        api_host: env.VITE_POSTHOG_HOST ?? '',
        person_profiles: 'identified_only',
        persistence: 'sessionStorage',
        loaded: ph => {
          ph.register_for_session({ environment: env.VITE_ENVIRONMENT_NAME });
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};
