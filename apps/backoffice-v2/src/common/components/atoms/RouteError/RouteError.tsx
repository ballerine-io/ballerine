import { useRouteError } from 'react-router-dom';
import { isErrorWithMessage } from '@ballerine/common';
import { ErrorAlert } from '../ErrorAlert/ErrorAlert';

export const RouteError = () => {
  const error = useRouteError();

  return (
    <ErrorAlert>{isErrorWithMessage(error) ? error.message : 'Something went wrong.'}</ErrorAlert>
  );
};
