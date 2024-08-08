import { CheckCircle } from '@/components/atoms/CheckCircle/CheckCircle';
import React, { FunctionComponent } from 'react';
import { Severity } from '@ballerine/common';
import { ctw } from '@/common';
import { WarningFilledSvg } from '@/components/atoms/WarningFilledSvg/WarningFilledSvg';

export const RiskIndicator = ({
  title,
  search,
  violations,
  Link,
}: {
  title: string;
  search: string | undefined;
  violations: Array<{
    label: string;
    severity: string;
  }>;
  Link: FunctionComponent<{
    search: string;
  }>;
}) => {
  return (
    <div>
      <h3 className="mb-3 space-x-4 font-bold text-slate-500">
        <span>{title}</span>
        {search && <Link search={search} />}
      </h3>
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
    </div>
  );
};
