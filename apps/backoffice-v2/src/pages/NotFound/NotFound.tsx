import React, { FunctionComponent } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

export const NotFoundRedirect: FunctionComponent = () => {
  const { state } = useLocation();
  const { locale } = useParams();

  return <Navigate to={`/${locale}/statistics`} replace state={state} />;
};
