import { FunctionComponent } from 'react';
import { BallerineLogo } from '../../atoms/icons';
import { Link } from 'react-router-dom';
import { env } from '../../../env/env';
import { useCustomerQuery } from '../../../../domains/customer/hook/queries/useCustomerQuery/userCustomerQuery';
import { AspectRatio } from '../../atoms/AspectRatio/AspectRatio';

/**
 * @description {@link BallerineLogo} with navigation to "/" on click.
 * @constructor
 */
export const Logo: FunctionComponent = () => {
  const { data: customer } = useCustomerQuery();
  const imageUrl = customer?.logoImageUri ?? env.VITE_IMAGE_LOGO_URL;

  return (
    <h1 className={`mb-11 flex`}>
      <Link
        to={`/en`}
        className={`btn btn-ghost flex h-20 w-full gap-x-3 text-2xl  normal-case focus:outline-primary`}
      >
        {imageUrl && (
          <AspectRatio ratio={2 / 1}>
            <img src={imageUrl} className={`d-full object-contain object-center`} />
          </AspectRatio>
        )}
        {!imageUrl && <BallerineLogo />}
      </Link>
    </h1>
  );
};
