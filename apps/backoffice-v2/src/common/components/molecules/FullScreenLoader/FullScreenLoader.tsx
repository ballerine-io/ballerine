import React, { FunctionComponent } from 'react';

export const FullScreenLoader: FunctionComponent = () => {
  return (
    <div className={`d-full flex items-center justify-center`}>
      <img src={'/public/images/loader.gif'} alt={'logo'} className={`d-[150px]`} />
    </div>
  );
};
