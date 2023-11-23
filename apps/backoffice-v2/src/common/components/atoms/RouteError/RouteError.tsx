import { Navigate, useRouteError } from 'react-router-dom';
import { isErrorWithMessage } from '@ballerine/common';
import { ErrorAlert } from '../ErrorAlert/ErrorAlert';
import { useAuthenticatedLayoutLogic } from '../../../../domains/auth/components/AuthenticatedLayout/hooks/useAuthenticatedLayoutLogic/useAuthenticatedLayoutLogic';

export const RouteError = () => {
  const error = useRouteError();
  const { redirectUnauthenticatedTo, location } = useAuthenticatedLayoutLogic();

  if (isErrorWithMessage(error) && error.message === 'Unauthorized (401)') {
    return (
      <Navigate
        to={redirectUnauthenticatedTo}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return (
    <ErrorAlert>{isErrorWithMessage(error) ? error.message : 'Something went wrong.'}</ErrorAlert>
  );
};
