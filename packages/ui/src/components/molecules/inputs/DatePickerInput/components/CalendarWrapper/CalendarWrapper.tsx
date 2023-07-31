import { AnyObject } from '@common/types';
import { forwardRef } from 'react';

export const CalendarWrapper = forwardRef(
  (props: AnyObject, ref: React.ForwardRefExoticComponent<HTMLDivElement>) => {
    return (
      <div className="mt-4" ref={ref}>
        <div {...props} className="bg-card text-card-foreground rounded-lg border shadow-sm" />
      </div>
    );
  },
);
