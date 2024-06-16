import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { ctw } from '@/common/utils/ctw/ctw';
import { Severity } from '@/common/types';
import { CheckCircle } from '@/common/components/atoms/CheckCircle/CheckCircle';

export const RiskIndicators: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
}> = ({ violations }) => {
  return (
    <Card>
      <CardHeader className={'pt-4 font-bold'}>Risk Indicators</CardHeader>
      <CardContent>
        <ul className="list-inside list-disc">
          {!!violations?.length &&
            violations.map(violation => (
              <li key={violation.label} className="flex list-none items-center text-slate-500">
                <WarningFilledSvg
                  className={ctw('me-3 mt-px', {
                    'text-slate-300 [&>:not(:first-child)]:stroke-background':
                      violation.severity === Severity.MEDIUM,
                  })}
                  width={'20'}
                  height={'20'}
                />
                {violation.label}
              </li>
            ))}
          {!violations?.length && (
            <li className="flex list-none items-center text-slate-500">
              <CheckCircle
                size={18}
                className={`stroke-background`}
                containerProps={{
                  className: 'me-3 bg-success',
                }}
              />
              No violations found
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
