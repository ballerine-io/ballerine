import * as React from 'react';
import { Spinner } from '../../../components/spinner';
import { ctw } from '@/common/utils/ctw/ctw';

export const ImageOverlay = React.memo(() => {
  return (
    <div
      className={ctw(
        'flex flex-row items-center justify-center',
        'absolute inset-0 rounded bg-[var(--mt-overlay)] opacity-100 transition-opacity',
      )}
    >
      <Spinner className="size-7" />
    </div>
  );
});

ImageOverlay.displayName = 'ImageOverlay';
