import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import {
  ExperienceBallerineCard,
  ExperienceBallerineCardProps,
} from '@/common/components/molecules/DemoAccessCards/ExperienceBallerineCard';
import { GetFullAccessCard } from '@/common/components/molecules/DemoAccessCards/GetFullAccessCard';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { ctw } from '@/common/utils/ctw/ctw';
import { WelcomeVideoCard } from '@/common/components/molecules/DemoAccessCards/WelcomeVideoCard';

export type DemoAccessWrapperProps = {
  children: ReactNode;
} & Omit<ExperienceBallerineCardProps, 'className'>;
export const DemoAccessWrapper = ({ children, ...props }: DemoAccessWrapperProps) => {
  const { data: customer } = useCustomerQuery();
  const { pathname } = useLocation();

  const isHomePage = pathname.includes('/home');
  const isWebPresencePage = pathname.includes('/merchant-monitoring');

  const cardWidth = isHomePage ? 'xl:w-1/3' : 'xl:w-1/2';

  return (
    <div className={ctw('space-y-10', { 'pt-6': !customer?.config?.isDemoAccount })}>
      {customer?.config?.isDemoAccount && (
        <>
          <div className="flex flex-col gap-4 px-6 pt-6 xl:flex-row">
            <ExperienceBallerineCard {...props} className={`w-full ${cardWidth}`} />
            {isHomePage && <WelcomeVideoCard className={`w-full ${cardWidth}`} />}
            <GetFullAccessCard className={`w-full ${cardWidth}`} />
          </div>

          <Separator />
        </>
      )}

      {children}
    </div>
  );
};
