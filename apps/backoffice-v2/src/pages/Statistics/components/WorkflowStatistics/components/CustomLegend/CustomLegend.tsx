import React, { ComponentProps } from 'react';
import { Legend } from 'recharts';
import { titleCase } from 'string-ts';

export const CustomLegend: ComponentProps<typeof Legend>['content'] = ({ payload }) => (
  <div className={'mb-6 flex items-end'}>
    <ul className="ms-auto">
      {payload?.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-x-2">
          <span
            className="mt-1 flex h-2 w-2 rounded-full"
            style={{
              backgroundColor: `rgb(0, 122, 255)`,
            }}
          />
          {titleCase(entry.value ?? '')}
        </li>
      ))}
    </ul>
  </div>
);
