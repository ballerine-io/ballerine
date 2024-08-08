import React, { FunctionComponent } from 'react';
import { ctw } from '@/common';
import { Card, CardContent, CardHeader } from '@/components/atoms';
import { CheckCircle } from '@/components/atoms/CheckCircle/CheckCircle';
import { WarningFilledSvg } from '@/components/atoms/WarningFilledSvg/WarningFilledSvg';
import { Severity } from '@ballerine/common';

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
                {violation.severity !== Severity.LOW && (
                  <WarningFilledSvg
                    className={ctw('me-3 mt-px', {
                      '[&>:not(:first-child)]:stroke-background text-slate-300':
                        violation.severity === Severity.MEDIUM,
                    })}
                    width={'20'}
                    height={'20'}
                  />
                )}
                {violation.severity === Severity.LOW && (
                  <CheckCircle
                    size={18}
                    className={`stroke-background`}
                    containerProps={{
                      className: 'me-4 bg-success mt-px',
                    }}
                  />
                )}
                {violation.label}
              </li>
            ))}
          {!violations?.length && (
            <li className="flex list-none items-center text-slate-500">
              <CheckCircle
                size={18}
                className={`stroke-background`}
                containerProps={{
                  className: 'me-3 bg-success mt-px',
                }}
              />
              No Violations Detected
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
