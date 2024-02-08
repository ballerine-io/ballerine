import React, { FunctionComponent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const NotFoundRedirect: FunctionComponent = () => {
  const { state } = useLocation();

  return <Navigate to={'/en'} replace state={state} />;
};
