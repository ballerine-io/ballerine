import { FunctionComponent } from 'react';
import { BallerineLogo } from '../../atoms/icons';
import { Link } from 'react-router-dom';
import { env } from '../../../env/env';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { AspectRatio } from '../../atoms/AspectRatio/AspectRatio';
import { useRedirectToRootUrl } from '@/common/hooks/useRedirectToRootUrl/useRedirectToRootUrl';
import { Skeleton } from '@ballerine/ui';
import { buttonVariants } from '@/common/components/atoms/Button/Button';

/**
 * @description {@link BallerineLogo} with navigation to "/" on click.
 * @constructor
 */
export const Logo: FunctionComponent = () => {
  const { data: customer, isLoading } = useCustomerQuery();
  const imageUrl = customer?.logoImageUri ?? env.VITE_IMAGE_LOGO_URL;
  const urlToRoot = useRedirectToRootUrl();

  return (
    <h1 className={`mb-11 flex`}>
      <Link
        to={urlToRoot}
        className={buttonVariants({
          className: `h-20 w-full hover:bg-slate-300/70`,
          variant: 'ghost',
        })}
      >
        {isLoading && <Skeleton className={`h-24 w-full`} />}
        {!isLoading && imageUrl && (
          <AspectRatio ratio={2 / 1}>
            <img src={imageUrl} className={`d-full object-contain object-center`} />
          </AspectRatio>
        )}
        {!isLoading && !imageUrl && <BallerineLogo />}
      </Link>
    </h1>
  );
};
