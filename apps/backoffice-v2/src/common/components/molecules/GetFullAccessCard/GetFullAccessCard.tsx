import { ctw } from '@ballerine/ui';
import { ArrowRightIcon, CrownIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { env } from '@/common/env/env';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { Button } from '../../atoms/Button/Button';
import { DataListImage } from './DataListImage';

export const GetFullAccessCard = () => {
  const [isHidden, setIsHidden] = useState(false);

  const { data: customer, isLoading } = useCustomerQuery();

  if (
    env.VITE_ENVIRONMENT_NAME === 'production' ||
    isLoading ||
    !customer?.config?.showFullAccessPopup
  ) {
    return null;
  }

  return (
    <div
      className={ctw(
        'fixed bottom-8 right-8 flex max-w-lg flex-nowrap items-center justify-between gap-2 rounded-md border border-purple-500 bg-white px-6 py-4',
        isHidden && 'hidden',
      )}
      style={{
        boxShadow: 'inset 0 24px 12px rgba(247, 241, 250, 1), 0 2px 6px rgba(208, 161, 255, 0.7)',
      }}
    >
      <div className="shrink-0 basis-7/12 space-y-4">
        <div className="flex items-center gap-2">
          <CrownIcon className="rounded-full bg-purple-200 p-[6px] font-bold text-purple-700 d-7" />
          <span className="text-lg font-medium">Get Full Access</span>
        </div>

        <p className="leading-relaxed">
          Unlock additional features and continue effective risk management with Ballerine.
        </p>

        <Button
          asChild
          variant="link"
          className="h-6 justify-start space-x-2 p-0 text-base text-blue-500"
        >
          <a
            href="https://calendly.com/d/cp53-ryw-4s3/ballerine-intro"
            target="_blank"
            rel="noreferrer"
          >
            <span>Talk to us</span>
            <ArrowRightIcon className="d-4" />
          </a>
        </Button>
      </div>

      <div className="h-full grow-0 basis-5/12">
        <DataListImage className="h-full" />
      </div>

      <button
        onClick={() => setIsHidden(true)}
        className="absolute right-2 top-2 p-2 text-purple-400 transition-colors hover:text-purple-600"
      >
        <XIcon className="d-4" />
      </button>
    </div>
  );
};
