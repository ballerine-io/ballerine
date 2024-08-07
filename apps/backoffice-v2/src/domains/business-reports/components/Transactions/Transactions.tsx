import React, { FunctionComponent } from 'react';
import { ArrowRight } from 'lucide-react';

import { PremiumSvg } from '@/common/components/atoms/icons';
import { Link } from 'react-router-dom';

export const Transactions: FunctionComponent = () => (
  <div className={`flex flex-row`}>
    <img
      alt={`Transaction Analysis`}
      src={'/images/TransactionAnalysis.png'}
      className={`h-[567px] max-h-[567px] w-[1236px] max-w-[1236px]`}
    />
    <div
      className={`mt-[10px] flex h-[328px] w-[293px] flex-col rounded-lg border-[1px] border-[#E3E0E9] p-6`}
    >
      <img
        alt={`Transaction Analysis`}
        src={'/images/TransactionIllustration.png'}
        className={`h-[129px] max-h-[129px] w-[224px] max-w-[224px] self-center`}
      />
      <div className={`mt-[20px] flex flex-row items-center space-x-2`}>
        <PremiumSvg
          className={`h-[26px] w-[26px] rounded-full bg-[#7F00FF]/20 p-1 text-[#7F00FF]`}
        />
        <span className={`w-full text-[18px] font-bold text-[#3D3D3D]`}>Premium Feature</span>
      </div>
      <p className={`mt-[10px] text-xs`}>
        Use Ballerine’s Transactions Analysis tool to leverage transaction data for additional
        insights into your merchant’s activity.
      </p>
      <Link
        target={`_blank`}
        to={`https://calendly.com/d/cp53-ryw-4s3/ballerine-intro`}
        className={`mt-3 flex flex-row items-center text-sm text-[#007AFF]`}
      >
        Talk to us <ArrowRight className={`ml-1`} size={16} />
      </Link>
    </div>
  </div>
);
