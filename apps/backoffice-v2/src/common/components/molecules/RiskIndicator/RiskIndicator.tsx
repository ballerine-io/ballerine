import { Link } from 'react-router-dom';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { ctw } from '@/common/utils/ctw/ctw';
import { CheckCircle } from '@/common/components/atoms/CheckCircle/CheckCircle';
import React from 'react';

export const RiskIndicator = ({
  title,
  to,
  violations,
}: {
  title: string;
  to: string;
  violations: Array<{
    label: string;
    severity: string;
  }>;
}) => {
  return (
    <div>
      <h3 className="mb-3 space-x-4 font-bold text-slate-500">
        <span>{title}</span>
        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
          })}
          to={to}
        >
          View
        </Link>
      </h3>
      <ul className="list-inside list-disc">
        {!!violations?.length &&
          violations.map(violation => (
            <li key={violation.label} className="flex list-none items-center text-slate-500">
              <WarningFilledSvg
                className={ctw('me-3 mt-px', {
                  'text-slate-300 [&>:not(:first-child)]:stroke-background':
                    violation.severity === 'low',
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
    </div>
  );
};
