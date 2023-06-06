import { FunctionComponent } from 'react';
import { BallerineLogo } from '../../atoms/icons';
import { Link } from 'react-router-dom';
import * as process from 'process';
import { Image } from 'lucide-react';
import { env } from '../../../env/env';

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
        {env.IMAGE_LOGO_URL ? (
          <img className={`h-20 w-40`} src={env.IMAGE_LOGO_URL} />
        ) : (
          <BallerineLogo />
        )}
      </Link>
    </h1>
  );
};
