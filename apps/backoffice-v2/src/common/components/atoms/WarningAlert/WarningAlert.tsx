import { FunctionComponent } from 'react';
import { IWarningAlertProps } from './interfaces';
import { WarningSvg } from '../icons';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description A closeable div element with a color of yellow and a warning icon.
 *
 * @param props - Props to pass to the root {@link WarningAlert} component.
 * @param props.children - The content to display within the {@link WarningAlert} component.
 * @param props.isOpen - A boolean of whether the {@link WarningAlert} component is visible.
 * @param props.iconProps - Props to pass to the icon's svg.
 * @constructor
 */
export const WarningAlert: FunctionComponent<IWarningAlertProps> = ({
  children,
  className,
  isOpen,
  iconProps = {},
  ...rest
}) => {
  const { className: iconClassName, ...restIcon } = iconProps;

  return (
    <div
      className={ctw(`alert alert-warning rounded-md shadow`, className, {
        hidden: !isOpen,
      })}
      {...rest}
    >
      <WarningSvg className={ctw(`h-6 w-6 shrink-0 stroke-current`, iconClassName)} {...restIcon} />
      {children}
    </div>
  );
};
