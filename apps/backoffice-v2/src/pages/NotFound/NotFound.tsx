import React, { FunctionComponent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRedirectToRootUrl } from '@/common/hooks/useRedirectToRootUrl/useRedirectToRootUrl';

export const NotFoundRedirect: FunctionComponent = () => {
  const { state } = useLocation();
  const urlToRoot = useRedirectToRootUrl();

  return <Navigate to={urlToRoot} replace state={state} />;
};
