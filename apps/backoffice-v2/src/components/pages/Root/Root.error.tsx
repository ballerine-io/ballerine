import { Button } from 'components/atoms/Button/button';
import { Link } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { Providers } from 'components/templates/Providers/Providers';
import { Layout } from 'components/templates/Layout/Layout';
import { Alert } from 'components/atoms/Alert/Alert';
import { AlertCircle } from 'lucide-react';
import { AlertTitle } from 'components/atoms/Alert/Alert.Title';
import { AlertDescription } from 'components/atoms/Alert/Alert.Description';

export const RootError = () => {
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
            <Alert variant={`destructive`} className={`w-full max-w-lg`}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Something went wrong.</AlertDescription>
              <div className={`flex justify-end`}>
                <Button asChild className={`border-destructive`} variant={`outline`} size={`sm`}>
                  <Link
                    to="/$locale"
                    params={{
                      locale: 'en',
                    }}
                    replace
                  >
                    Try again
                  </Link>
                </Button>
              </div>
            </Alert>
          </div>
        </section>
      </Layout>
    </Providers>
  );
};
