import { WarningAlert } from '../../../../common/components/atoms/WarningAlert';
import React, { FunctionComponent } from 'react';
import { IAlertProps } from './interfaces';

export const Alert: FunctionComponent<IAlertProps> = ({ value }) => (
  <WarningAlert isOpen className={`w-6/12 text-base-content theme-dark:text-base-100`}>
    {value}
  </WarningAlert>
);
