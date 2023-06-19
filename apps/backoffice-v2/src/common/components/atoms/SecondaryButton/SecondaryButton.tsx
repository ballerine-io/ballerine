import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { TSecondaryButtonProps } from './types';
import { FunctionComponentWithChildren } from '../../../types';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description Wraps children with a {@link PrimaryButton} component and applies default styling.
 * @param props
 * @constructor
 */
export const SecondaryButton: FunctionComponentWithChildren<TSecondaryButtonProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <PrimaryButton
      className={ctw(
        `hover:ring-ballerine flex items-center justify-center !rounded-full bg-black/40 p-2 text-white d-8 hover:bg-black/40`,
        className,
      )}
      {...rest}
    >
      {children}
    </PrimaryButton>
  );
};
