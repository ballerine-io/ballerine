import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CheckCircle } from '@ballerine/ui';

export const Recommendations: FunctionComponent<{
  recommendations: string[];
}> = ({ recommendations }) => {
  return (
    <Card className={'col-span-full'}>
      <CardHeader className={'pt-4 font-bold'}>Recommendations</CardHeader>
      <CardContent>
        <ul className={'space-y-2'}>
          {!!recommendations?.length &&
            recommendations.map(recommendation => (
              <li key={recommendation} className={'flex list-none items-center'}>
                <CheckCircle
                  size={20}
                  className={`stroke-transparent`}
                  containerProps={{
                    className: 'me-3 bg-info/20',
                  }}
                />
                {recommendation}
              </li>
            ))}
          {!recommendations?.length && (
            <li className={'flex list-none items-center'}>
              <CheckCircle
                size={20}
                className={`stroke-transparent`}
                containerProps={{
                  className: 'me-3 bg-info/20',
                }}
              />
              No recommendations found.
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
