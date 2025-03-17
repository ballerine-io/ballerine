import { ctw } from '@ballerine/ui';
import { ArrowRightIcon, CrownIcon } from 'lucide-react';

import { Button } from '@/common/components/atoms/Button/Button';
import { BALLERINE_CALENDLY_LINK } from '@/common/constants';
import dashboardImage from './dashboard.png';

export type GetFullAccessCardProps = {
  className?: string;
};

export const GetFullAccessCard = ({ className }: GetFullAccessCardProps) => {
  return (
    <div
      className={ctw(
        'relative overflow-hidden rounded-md border border-wp-primary px-6 py-4',
        className,
      )}
    >
      <div className="shrink-0 space-y-4">
        <div className="flex items-center gap-2">
          <CrownIcon className="rounded-full bg-wp-primary/30 p-[6px] font-bold text-wp-primary d-7" />
          <span className="text-lg font-medium">Get Full Access / Learn More</span>
        </div>

        <p className="w-3/5 leading-relaxed 2xl:w-1/2">
          Get unlimited access to Ballerine, for smarter onboarding and monitoring decisions.
        </p>

        <Button asChild variant="wp-primary" className="justify-start space-x-2 text-base">
          <a href={BALLERINE_CALENDLY_LINK} target="_blank" rel="noreferrer">
            <span>Book a quick call</span>
            <ArrowRightIcon className="d-4" />
          </a>
        </Button>
      </div>

      <div className="absolute -right-24 top-12 2xl:-right-4 2xl:top-6">
        <img src={dashboardImage} alt="Dashboard image" className="h-full" />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(88, 78, 197, 0.22) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, rgba(88, 78, 197, 0.22) 92%)',
        }}
      />
    </div>
  );
};
