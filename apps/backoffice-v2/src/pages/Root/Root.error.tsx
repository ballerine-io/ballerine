import { Button } from '../../common/components/atoms/Button/Button';
import { Link, Navigate, useRouteError } from 'react-router-dom';
import { FunctionComponent } from 'react';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { ErrorAlert } from '../../common/components/atoms/ErrorAlert/ErrorAlert';
import { useAuthenticatedLayoutLogic } from '../../domains/auth/components/AuthenticatedLayout/hooks/useAuthenticatedLayoutLogic/useAuthenticatedLayoutLogic';
import { isErrorWithMessage } from '@ballerine/common';

export const RootError: FunctionComponent = () => {
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
    <Providers>
      <section
        className={`col-span-full mx-auto mt-32 grid h-full w-full max-w-4xl grid-cols-2 flex-col`}
      >
        <div>
          <ErrorAlert>
            Something went wrong.
            <div className={`flex justify-end`}>
              <Button asChild className={`border-destructive`} variant={`outline`} size={`sm`}>
                <Link to={`/en`} replace>
                  Try again
                </Link>
              </Button>
            </div>
          </ErrorAlert>
        </div>
      </section>
    </Providers>
  );
};
