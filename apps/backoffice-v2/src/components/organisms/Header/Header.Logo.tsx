import { FunctionComponent } from 'react';
import { BallerineLogo } from 'components/atoms/icons';
import { Link } from '@tanstack/react-router';

/**
 * @description {@link BallerineLogo} with navigation to "/" on click.
 * @constructor
 */
export const Logo: FunctionComponent = () => {
  return (
    <h1 className={`mb-11 flex`}>
      <Link
        to="/$locale"
        params={{
          locale: 'en',
        }}
        className={`btn-ghost btn flex gap-x-3 text-2xl  normal-case focus:outline-primary`}
      >
        <BallerineLogo />
      </Link>
    </h1>
  );
};
