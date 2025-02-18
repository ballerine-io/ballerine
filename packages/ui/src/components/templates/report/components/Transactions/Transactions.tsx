import { ArrowRight } from 'lucide-react';
import { FunctionComponent } from 'react';

import { Image } from '@/components';
import { PremiumFeature } from '@/components/molecules/PremiumFeature';

export const Transactions: FunctionComponent = () => {
  return (
    <div className={`relative flex`}>
      <Image
        width={1236}
        height={567}
        alt={`Transaction Analysis`}
        src={'/images/transaction-analysis.png'}
        className={`d-full max-w-[1236px]`}
      />
      <PremiumFeature
        className={`right-6 top-5 2xl:right-[4.5rem]`}
        content={
          <p className={`mt-3 text-xs`}>
            Use Ballerine’s Transactions Analysis tool to leverage transaction data for additional
            insights into your merchant’s activity.
          </p>
        }
        footer={
          <a
            target={`_blank`}
            className={`mt-3 flex items-center text-sm text-[#007AFF]`}
            href={`https://calendly.com/d/cp53-ryw-4s3/ballerine-intro`}
          >
            Talk to us <ArrowRight className={`ms-1`} size={16} />
          </a>
        }
      />
    </div>
  );
};
