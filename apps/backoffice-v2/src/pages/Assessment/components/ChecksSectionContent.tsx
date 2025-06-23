import { ShieldAlertIcon, ShieldCheckIcon, ShieldQuestionIcon } from 'lucide-react';
import React from 'react';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@ballerine/ui';
import { CheckItem, CheckStatus } from '../types';

interface ChecksSectionContentProps {
  assessmentChecks: CheckItem[];
}

const checkIconMap: Record<CheckStatus, JSX.Element> = {
  positive: <ShieldCheckIcon className="size-5 text-green-500" />,
  negative: <ShieldAlertIcon className="size-5 text-red-500" />,
  neutral: <ShieldQuestionIcon className="size-5" />,
};

export const ChecksSectionContent: React.FC<ChecksSectionContentProps> = ({ assessmentChecks }) => {
  return (
    <Card>
      <CardContent className="grid grid-cols-3 gap-4 p-6">
        {assessmentChecks.length > 0 ? (
          assessmentChecks.map((check, index) => (
            <div
              key={`${check.displayName}-${index}`}
              className={ctw(
                'flex h-16 items-center justify-between rounded-md border border-gray-200 px-4',
                check.status === 'positive' && 'bg-green-50',
                check.status === 'negative' && 'bg-red-50',
              )}
            >
              <p className="font-semibold">{check.displayName}</p>

              <div className="flex w-[6.5rem] items-center gap-3">
                <p>{checkIconMap[check.status]}</p>
                <p>{check.note}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-4 text-center text-gray-500">No checks data available</div>
        )}
      </CardContent>
    </Card>
  );
};
