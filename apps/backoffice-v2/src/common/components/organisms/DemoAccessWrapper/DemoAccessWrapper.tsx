import { ReactNode } from 'react';

import {
  ExperienceBallerineCard,
  ExperienceBallerineCardProps,
} from '@/common/components/molecules/DemoAccessCards/ExperienceBallerineCard';
import { GetFullAccessCard } from '@/common/components/molecules/DemoAccessCards/GetFullAccessCard';
import { Separator } from '@/common/components/atoms/Separator/Separator';

export type DemoAccessWrapperProps = {
  children: ReactNode;
} & Omit<ExperienceBallerineCardProps, 'className'>;
export const DemoAccessWrapper = ({ children, ...props }: DemoAccessWrapperProps) => {
  return (
    <div className="space-y-10">
      <div className="flex gap-4 px-6 pt-6">
        <ExperienceBallerineCard {...props} className="w-1/2" />
        <GetFullAccessCard className="w-1/2" />
      </div>

      <Separator />

      {children}
    </div>
  );
};
