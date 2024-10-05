import { buttonVariants, useReportTabs } from '@ballerine/ui';
import { Link } from 'react-router-dom';
import React from 'react';

export const RiskIndicatorLink: Parameters<typeof useReportTabs>[0]['Link'] = ({ search }) => (
  <Link
    className={buttonVariants({
      variant: 'link',
      className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
    })}
    to={{
      search,
    }}
  >
    View
  </Link>
);
