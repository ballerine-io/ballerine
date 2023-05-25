import { Button } from 'components/atoms/Button/button';
import { Link } from '@tanstack/react-router';
import { BallerineLogo } from 'components/atoms/icons';

export const RootError = () => {
  return (
    <main className={`h-full p-4`}>
      <section className={`mx-auto mt-32 grid h-full w-full max-w-4xl grid-cols-2 flex-col`}>
        <div>
          <h1 className={`mb-4 w-full text-6xl font-bold`}>Error</h1>
          <p className={`mb-10 w-full text-3xl`}>Something went wrong.</p>
          <Button asChild className={`me-auto`}>
            <Link
              to="/$locale"
              params={{
                locale: 'en',
              }}
              replace
            >
              Go back to the home page
            </Link>
          </Button>
        </div>
        <BallerineLogo viewBox={`0 0 153 34`} width={`459`} height={`102`} className={`mt-2.5`} />
      </section>
    </main>
  );
};
