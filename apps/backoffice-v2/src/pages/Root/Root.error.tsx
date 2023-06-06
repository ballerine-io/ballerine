import { Button } from '../../common/components/atoms/Button/Button';
import { Link } from 'react-router-dom';
import { FunctionComponent } from 'react';
import { AlertDescription } from '../../common/components/atoms/Alert/Alert.Description';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { Toaster } from 'react-hot-toast';
import { Layout } from '../../common/components/templates/Layout/Layout';
import { Alert } from '../../common/components/atoms/Alert/Alert';
import { AlertCircle } from 'lucide-react';
import { AlertTitle } from '../../common/components/atoms/Alert/Alert.Title';

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
            <Alert variant={`destructive`} className={`w-full max-w-lg`}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Something went wrong.</AlertDescription>
              <div className={`flex justify-end`}>
                <Button asChild className={`border-destructive`} variant={`outline`} size={`sm`}>
                  <Link to={`/en`} replace>
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
