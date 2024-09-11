import React, { ReactNode } from 'react';
import { Crown } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, Image } from '@/components';

export const PremiumFeature = ({ footer, content }: { footer: ReactNode; content: ReactNode }) => (
  <Card
    className={`bg-background absolute right-6 top-5 flex max-h-[328px] max-w-[293px] flex-col rounded-lg border-[1px] border-[#E3E0E9] p-6 2xl:right-[4.5rem]`}
  >
    <CardHeader className={`p-0`}>
      <Image
        width={224}
        height={129}
        alt={`Transaction Illustration`}
        src={'/images/transaction-illustration.png'}
        className={`max-h-[129px] max-w-[224px] self-center`}
      />
    </CardHeader>
    <CardContent className={`p-0`}>
      <div className={`mt-5 flex items-center space-x-2`}>
        <Crown className={`d-6 rounded-full bg-[#7F00FF]/20 p-1 text-[#7F00FF]`} />
        <span className={`w-full text-lg font-bold text-[#3D3D3D]`}>Premium Feature</span>
      </div>
      {content}
    </CardContent>
    <CardFooter className={`p-0`}>{footer}</CardFooter>
  </Card>
);
