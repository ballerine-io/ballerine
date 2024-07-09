import { Providers } from '@/common/components/templates/Providers/Providers';
import React from 'react';
import { NotFoundRedirect } from '@/pages/NotFound/NotFound';

export const NotFoundRedirectWithProviders = () => {
  return (
    <Providers>
      <NotFoundRedirect />
    </Providers>
  );
};
