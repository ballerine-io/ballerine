import React, { FunctionComponent } from 'react';
import { ctw } from '../../../../../utils/ctw/ctw';
import { components } from 'components/pages/Individual/hooks/useIndividual/components';
import { IContainerProps } from 'components/pages/Individual/components/Container/interfaces';

export const Container: FunctionComponent<IContainerProps> = ({ value, id }) => {
  return (
    <div
      className={ctw({
        'm-2 mt-6 flex justify-end space-x-2 rounded p-2 text-slate-50': id === 'actions',
        rounded: id === 'alerts',
        'col-span-full': id === 'alerts' || id === 'header',
        'grid grid-cols-2': id === 'header',
        'm-2 flex flex-col space-y-2 p-2': id === 'alerts',
      })}
    >
      {value?.map((cell, index) => {
        const Cell = components[cell?.type];

        return <Cell key={index} {...cell} />;
      })}
    </div>
  );
};
