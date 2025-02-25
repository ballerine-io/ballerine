import { ReactNode } from 'react';

import {
  ExperienceBallerineCard,
  ExperienceBallerineCardProps,
} from '@/common/components/molecules/DemoAccessCards/ExperienceBallerineCard';
import { GetFullAccessCard } from '@/common/components/molecules/DemoAccessCards/GetFullAccessCard';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { env } from '@/common/env/env';

export type DemoAccessWrapperProps = {
  children: ReactNode;
} & Omit<ExperienceBallerineCardProps, 'className'>;
export const DemoAccessWrapper = ({ children, ...props }: DemoAccessWrapperProps) => {
  if (env.VITE_ENVIRONMENT_NAME === 'sandbox') {
    return <div className="mt-6 space-y-10">{children}</div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 px-6 pt-6 xl:flex-row">
        <ExperienceBallerineCard {...props} className="w-full xl:w-1/2" />
        <GetFullAccessCard className="w-full xl:w-1/2" />
      </div>

      <Separator />

      {children}
    </div>
  );
};
