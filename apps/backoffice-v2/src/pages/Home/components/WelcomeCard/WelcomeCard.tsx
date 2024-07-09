import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { WelcomeSvg } from '@/pages/Home/components/WelcomeSvg/WelcomeSvg';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import React from 'react';

export const WelcomeCard = () => {
  return (
    <Card className={'max-w-xl'}>
      <CardHeader>
        <WelcomeSvg />
        <h3 className={'text-lg font-bold'}>Welcome to Ballerine's Risk Management Dashboard!</h3>
      </CardHeader>
      <CardContent>
        <p>Use the sidebar to navigate and start managing your risk flows and processes.</p>
      </CardContent>
    </Card>
  );
};
