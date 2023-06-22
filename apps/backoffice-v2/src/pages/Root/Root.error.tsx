import { Button } from '../../common/components/atoms/Button/Button';
import { Link } from 'react-router-dom';
import { FunctionComponent } from 'react';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { Toaster } from 'react-hot-toast';
import { Layout } from '../../common/components/templates/Layout/Layout';
import { ErrorAlert } from '../../common/components/atoms/ErrorAlert/ErrorAlert';

export const RootError: FunctionComponent = () => {
  return (
    <Providers>
      <Toaster
        toastOptions={{
          position: 'top-center',
          // In milliseconds
          duration: 1000 * 3,
        }}
      />
      <Layout>
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
      </Layout>
    </Providers>
  );
};
