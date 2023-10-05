import React, { FunctionComponent } from 'react';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { IContainerProps } from './interfaces';
import { cells } from '../../hooks/useEntity/cells';

export const Container: FunctionComponent<IContainerProps> = ({ value, id, props }) => {
  return (
    <div
      className={ctw(
        {
          'mt-6 flex justify-end space-x-4 rounded p-2 text-slate-50': id === 'actions',
          rounded: id === 'alerts',
          'col-span-full': id === 'alerts' || id === 'header',
          'grid grid-cols-2': id === 'header' || id === 'map-container' || id === 'kyc-block',
          'm-2 flex flex-col space-y-2 p-2': id === 'alerts',
        },
        props?.className,
      )}
    >
      {value?.map((cell, index) => {
        const Cell = cells[cell?.type];

        return <Cell key={index} {...cell} />;
      })}
    </div>
  );
};
