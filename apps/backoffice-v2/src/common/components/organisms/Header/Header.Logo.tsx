import { FunctionComponent } from 'react';
import { BallerineLogo } from '../../atoms/icons';
import { Link } from 'react-router-dom';

/**
 * @description {@link BallerineLogo} with navigation to "/" on click.
 * @constructor
 */
export const Logo: FunctionComponent = () => {
  return (
    <h1 className={`mb-16 flex`}>
      <Link
        to={`/en`}
        className={`btn-ghost btn flex gap-x-3 text-2xl  normal-case focus:outline-primary`}
      >
        <BallerineLogo />
      </Link>
    </h1>
  );
};
