import { ctw } from '@ballerine/ui';
import { BaseIndicatorProps } from './types';

export const BaseIndicator = ({ children = null, icon = null, className }: BaseIndicatorProps) => {
  return (
    <div className="bg-white">
      <div
        className={ctw(
          'box-border h-3 w-3 rounded-full border',
          { 'flex items-center justify-center border-none': Boolean(icon) },
          className,
        )}
      >
        {icon ? icon : children}
      </div>
    </div>
  );
};
