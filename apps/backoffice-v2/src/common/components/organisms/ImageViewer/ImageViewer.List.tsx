import { FunctionComponent } from 'react';
import { TListProps } from './types';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description To be used by {@link ImageViewer}. Uses a ul element to display a list of images with default styling.
 *
 * @param props
 * @param props.children - Expects {@link ImageViewer.Item} components.
 * @constructor
 */
export const List: FunctionComponent<TListProps> = ({ children, className, ...rest }) => {
  return (
    <ul className={ctw(`grid grid-cols-3 gap-2`, className)} {...rest}>
      {children}
    </ul>
  );
};
