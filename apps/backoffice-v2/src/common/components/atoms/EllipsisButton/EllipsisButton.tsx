import { FunctionComponent } from 'react';
import { EllipsisSvg } from '../icons';
import { ButtonComponent } from '../../../types';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description Wraps {@link EllipsisSvg} with a {@link PrimaryButton} component and applies default styling.
 * @param props
 * @constructor
 */
export const EllipsisButton: FunctionComponent<ButtonComponent> = ({ className, ...props }) => {
  return (
    <button className={ctw(`btn btn-square focus:outline-primary`, className)} {...props}>
      <EllipsisSvg />
    </button>
  );
};
