import { ReactNode } from 'react';

import {
  ExperienceBallerineCard,
  ExperienceBallerineCardProps,
} from '@/common/components/molecules/DemoAccessCards/ExperienceBallerineCard';
import { GetFullAccessCard } from '@/common/components/molecules/DemoAccessCards/GetFullAccessCard';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { ctw } from '@/common/utils/ctw/ctw';

export type DemoAccessWrapperProps = {
  children: ReactNode;
} & Omit<ExperienceBallerineCardProps, 'className'>;
export const DemoAccessWrapper = ({ children, ...props }: DemoAccessWrapperProps) => {
  const { data: customer } = useCustomerQuery();

  return (
    <div className={ctw('space-y-10', { 'pt-6': !customer?.config?.isDemoAccount })}>
      {customer?.config?.isDemoAccount && (
        <>
          <div className="flex flex-col gap-4 px-6 pt-6 xl:flex-row">
            <ExperienceBallerineCard {...props} className="w-full xl:w-1/2" />
            <GetFullAccessCard className="w-full xl:w-1/2" />
          </div>

          <Separator />
        </>
      )}

      {children}
    </div>
  );
};
