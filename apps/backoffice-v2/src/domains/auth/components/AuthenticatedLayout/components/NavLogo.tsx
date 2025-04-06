import { Skeleton } from '@ballerine/ui';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { AspectRatio } from '@/common/components/atoms/AspectRatio/AspectRatio';
import { BallerineLogo } from '@/common/components/atoms/icons';
import { env } from '@/common/env/env';
import { useRedirectToRootUrl } from '@/common/hooks/useRedirectToRootUrl/useRedirectToRootUrl';
import { ctw } from '@/common/utils/ctw/ctw';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

const LogoContent = () => {
  const { data: customer, isLoading } = useCustomerQuery();
  const imageUrl = customer?.logoImageUri ?? env.VITE_IMAGE_LOGO_URL;

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (imageUrl) {
    return (
      <AspectRatio ratio={2 / 1}>
        <img src={imageUrl} className="d-full object-contain object-center" />
      </AspectRatio>
    );
  }

  return <BallerineLogo />;
};

export const NavLogo: FunctionComponent<{ className?: string }> = ({ className }) => {
  const urlToRoot = useRedirectToRootUrl();

  return (
    <Link to={urlToRoot} className={ctw('w-full cursor-pointer pr-12', className)}>
      <LogoContent />
    </Link>
  );
};
