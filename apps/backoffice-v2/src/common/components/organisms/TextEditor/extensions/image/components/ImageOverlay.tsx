import * as React from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { Spinner } from '@/common/components/organisms/TextEditor/components/Spinner';

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
