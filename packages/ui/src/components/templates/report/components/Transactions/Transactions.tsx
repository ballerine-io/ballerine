import { ArrowRight, Crown } from 'lucide-react';
import React, { FunctionComponent } from 'react';

export const Transactions: FunctionComponent = () => (
  <div className={`flex`}>
    <img
      alt={`Transaction Analysis`}
      src={'/images/transaction-analysis.png'}
      className={`h-[567px] w-[1236px]`}
    />
    <div
      className={`mt-3 flex h-[328px] w-[293px] flex-col rounded-lg border-[1px] border-[#E3E0E9] p-6`}
    >
      <img
        alt={`Transaction Illustration`}
        src={'/images/transaction-illustration.png'}
        className={`h-[129px] w-[224px] self-center`}
      />
      <div className={`mt-5 flex items-center space-x-2`}>
        <Crown className={`d-6 rounded-full bg-[#7F00FF]/20 p-1 text-[#7F00FF]`} />
        <span className={`w-full text-lg font-bold text-[#3D3D3D]`}>Premium Feature</span>
      </div>
      <p className={`mt-3 text-xs`}>
        Use Ballerine’s Transactions Analysis tool to leverage transaction data for additional
        insights into your merchant’s activity.
      </p>
      <a
        target={`_blank`}
        className={`mt-3 flex items-center text-sm text-[#007AFF]`}
        href={`https://calendly.com/d/cp53-ryw-4s3/ballerine-intro`}
      >
        Talk to us <ArrowRight className={`ms-1`} size={16} />
      </a>
    </div>
  </div>
);
