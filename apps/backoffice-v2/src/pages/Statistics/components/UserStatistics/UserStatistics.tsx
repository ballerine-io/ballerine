import React, { FunctionComponent } from 'react';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardFooter } from '@/common/components/atoms/Card/Card.Footer';
import { useUserStatisticsLogic } from '@/pages/Statistics/components/UserStatistics/hooks/useUserStatisticsLogic/useUserStatisticsLogic';

export const UserStatistics: FunctionComponent<{
  fullName: string;
}> = ({ fullName }) => {
  const { statistics } = useUserStatisticsLogic();

  return (
    <div>
      <TextWithNAFallback as={'h5'} className={'mb-4 font-bold'}>
        {fullName ? `${fullName}'s statistics` : ''}
      </TextWithNAFallback>
      <div className={'grid grid-cols-3 gap-6'}>
        {statistics.map(({ title, stat, description }) => (
          <div key={title} className={'min-h-[10.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
            <Card className={'flex h-full flex-col px-3'}>
              <CardHeader className={'pb-1'}>{title}</CardHeader>
              <CardContent>{stat}</CardContent>
              {!!description && (
                <CardFooter className={'mt-auto'}>
                  <p className={'text-sm text-slate-500'}>{description}</p>
                </CardFooter>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
