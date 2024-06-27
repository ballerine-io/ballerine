import React, { FunctionComponent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const NotFoundRedirect: FunctionComponent = () => {
  const { state } = useLocation();
  const locale = useLocale();

  return <Navigate to={`/${locale}/home/statistics`} replace state={state} />;
};
