import { FunctionComponent } from 'react';
import { PrimaryButton } from 'components/atoms/PrimaryButton/PrimaryButton';
import { EllipsisSvg } from 'components/atoms/icons';
import { ButtonComponent } from '../../../types';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description Wraps {@link EllipsisSvg} with a {@link PrimaryButton} component and applies default styling.
 * @param props
 * @constructor
 */
export const EllipsisButton: FunctionComponent<ButtonComponent> = ({
  className,
  ...props
}) => {
  return (
    <button
      className={ctw(`btn-square btn focus:outline-primary`, className)}
      {...props}
    >
      <EllipsisSvg />
    </button>
  );
};
