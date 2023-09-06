import { forwardRef } from 'react';
import { ISafeIFrameProps } from './interfaces';

export const SafeIFrame = forwardRef<HTMLIFrameElement, ISafeIFrameProps>(
  ({ sandbox: _sandbox, referrerPolicy: _referrerPolicy, ...props }, ref) => {
    return <iframe {...props} ref={ref} sandbox={''} referrerPolicy={'no-referrer'} />;
  },
);
