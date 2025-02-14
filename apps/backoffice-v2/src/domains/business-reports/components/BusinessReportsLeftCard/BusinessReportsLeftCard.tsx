import { ReactNode } from 'react';

import { ctw } from '@/common/utils/ctw/ctw';

export type BusinessReportsLeftCardProps = {
  reportsLeft: number | null | undefined;
  demoDaysLeft: number | null | undefined;
  className?: string;
};

export const BusinessReportsLeftCard = ({
  reportsLeft,
  demoDaysLeft,
  className,
}: BusinessReportsLeftCardProps) => {
  if (
    reportsLeft === null ||
    demoDaysLeft === null ||
    reportsLeft === undefined ||
    demoDaysLeft === undefined
  ) {
    return null;
  }

  const state = demoDaysLeft <= 0 ? 'expired' : reportsLeft <= 0 ? 'noReports' : 'active';

  const messages: Record<string, ReactNode> = {
    expired: <span className="text-destructive">Your demo account has expired!</span>,
    noReports: <span className="text-destructive">You don&apos;t have any reports left!</span>,
    active: (
      <span>
        You have <span className="font-bold">{reportsLeft} free reports</span> left to create,
        available for <span className="font-bold">{demoDaysLeft} days.</span>
      </span>
    ),
  };

  return (
    <div
      className={ctw(
        'rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-center font-medium',
        className,
      )}
    >
      {messages[state]}
    </div>
  );
};
