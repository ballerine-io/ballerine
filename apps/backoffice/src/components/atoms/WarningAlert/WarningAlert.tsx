import React, { FunctionComponent } from 'react';
import { Alert } from '@pankod/refine-mantine';
import { IWarningAlertProps } from './interfaces';
import { WarningSvg } from '../WarningSvg/WarningSvg';

/**
 * @description Mantine's Alert component with a color of yellow and a warning icon.
 *
 * References:
 * - [Alert documentation](https://mantine.dev/core/alert/)
 *
 * @param props - Props to pass to the root Alert component.
 * @param props.children - The content to display within the Alert component.
 * @param props.iconProps - Props to pass to the icon's svg.
 * @constructor
 */
export const WarningAlert: FunctionComponent<IWarningAlertProps> = props => {
  const { children, iconProps = {}, ...rest } = props;
  const { ...restIcon } = iconProps;

  return (
    <Alert
      icon={<WarningSvg {...restIcon} />}
      sx={{
        backgroundColor: '#fff8ef',
      }}
      {...rest}
    >
      {children}
    </Alert>
  );
};
