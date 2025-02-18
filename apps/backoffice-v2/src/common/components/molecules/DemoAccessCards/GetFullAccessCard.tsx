import { ctw } from '@ballerine/ui';
import { ArrowRightIcon, CrownIcon } from 'lucide-react';

import { env } from '@/common/env/env';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { Button } from '../../atoms/Button/Button';
import dashboardImage from './dashboard.png';

export type GetFullAccessCardProps = {
  className?: string;
};

export const GetFullAccessCard = ({ className }: GetFullAccessCardProps) => {
  const { data: customer, isLoading } = useCustomerQuery();

  if (env.VITE_ENVIRONMENT_NAME === 'production' || isLoading || !customer?.config?.isDemoAccount) {
    return null;
  }

  return (
    <div
      className={ctw(
        'relative overflow-hidden rounded-md border border-wp-primary px-6 py-4',
        className,
      )}
      style={{
        background:
          'linear-gradient(120deg, rgba(88, 78, 197, 0.22) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 85%, rgba(88, 78, 197, 0.22) 92%)',
      }}
    >
      <div className="!w-2/3 shrink-0 space-y-4 xl:w-1/2">
        <div className="flex items-center gap-2">
          <CrownIcon className="rounded-full bg-wp-primary/30 p-[6px] font-bold text-wp-primary d-7" />
          <span className="text-lg font-medium">Get Full Access / Learn More</span>
        </div>

        <p className="leading-relaxed">
          Get unlimited access to Ballerine, for smarter onboarding and monitoring decisions.
        </p>

        <Button asChild variant="wp-primary" className="justify-start space-x-2 text-base">
          <a href={env.VITE_BALLERINE_CALENDLY} target="_blank" rel="noreferrer">
            <span>Book a quick call</span>
            <ArrowRightIcon className="d-4" />
          </a>
        </Button>
      </div>

      <div className="absolute -right-16 top-1/3 -z-10">
        <img src={dashboardImage} alt="Dashboard image" className="h-full" />
      </div>
    </div>
  );
};
