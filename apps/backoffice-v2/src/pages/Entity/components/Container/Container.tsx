import React, { FunctionComponent } from 'react';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { IContainerProps } from './interfaces';
import { cells } from '../../hooks/useEntity/cells';

export const Container: FunctionComponent<IContainerProps> = ({ value, id }) => {
  return (
    <div
      className={ctw({
        'm-2 mt-6 flex justify-end space-x-2 rounded p-2 text-slate-50': id === 'actions',
        rounded: id === 'alerts',
        'col-span-full': id === 'alerts' || id === 'header',
        'grid grid-cols-2': id === 'header' || id === 'map-container',
        'm-2 flex flex-col space-y-2 p-2': id === 'alerts',
      })}
    >
      {value?.map((cell, index) => {
        const Cell = cells[cell?.type];

        return <Cell key={index} {...cell} />;
      })}
    </div>
  );
};
