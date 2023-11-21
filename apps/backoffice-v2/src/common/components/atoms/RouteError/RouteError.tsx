import { Navigate, useRouteError } from 'react-router-dom';
import { isErrorWithCode, isErrorWithMessage } from '@ballerine/common';
import { ErrorAlert } from '../ErrorAlert/ErrorAlert';
import { useAuthenticatedLayoutLogic } from '../../../../domains/auth/components/AuthenticatedLayout/hooks/useAuthenticatedLayoutLogic/useAuthenticatedLayoutLogic';

export const RouteError = () => {
  const error = useRouteError();
  const { redirectUnauthenticatedTo, location } = useAuthenticatedLayoutLogic();

  if (isErrorWithCode(error) && error.code === 401) {
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
