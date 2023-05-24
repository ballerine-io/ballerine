import { FunctionComponent } from 'react';
import { IMagnifyingGlassButtonProps } from './interfaces';
import { MagnifyingGlassSvg } from '../icons';
import { SecondaryButton } from '../SecondaryButton/SecondaryButton';

/**
 * @description Wraps {@link MagnifyingGlassSvg} with a {@link SecondaryButton} component.
 * @param props
 * @constructor
 */
export const MagnifyingGlassButton: FunctionComponent<IMagnifyingGlassButtonProps> = ({
  className,
  ...rest
}) => {
  return (
    <SecondaryButton className={className} {...rest}>
      <MagnifyingGlassSvg />
    </SecondaryButton>
  );
};
