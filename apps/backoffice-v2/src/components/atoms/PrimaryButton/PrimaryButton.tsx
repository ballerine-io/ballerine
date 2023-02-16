import { FunctionComponent } from 'react';
import { ButtonComponent } from '../../../types';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description A button element styled with re-occurring CSS, including styling for hover, focus, and active pseudo-states.
 * @param children
 * @param className
 * @param props
 * @constructor
 */
export const PrimaryButton: FunctionComponent<ButtonComponent> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={ctw(
        `
                focus-visible:ring-ballerine
                active:ring-ballerine
                flex
                items-center
                rounded-md
                p-2
                leading-snug
                text-base-content
                outline-none
                hover:bg-primary/10
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:ring-0
                `,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
