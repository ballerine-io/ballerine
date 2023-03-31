import { FunctionComponent } from 'react';
import { BallerineLogo } from '@/components/atoms/icons';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/atoms/Button';

/**
 * @description {@link BallerineLogo} with navigation to "/" on click.
 * @constructor
 */
export const Logo: FunctionComponent = () => {
  return (
    <h1 className={`mb-11 flex`}>
      <Button
        variant={'ghost'}
        fullWidth
        as={Link}
        to="/$locale"
        params={{
          locale: 'en',
        }}
        className={`btn-ghost btn flex gap-x-3 text-2xl  normal-case focus:outline-primary`}
      >
        <BallerineLogo /> Ballerine
      </Button>
    </h1>
  );
};
