import { ctw } from '@/common/utils/ctw/ctw';
import React, { ComponentProps, FunctionComponent } from 'react';
import { DownloadFileSvg } from '@/common/components/atoms/icons';

export interface IDownloadFile extends ComponentProps<'div'> {
  heading: string;
}

export const DownloadFile: FunctionComponent<IDownloadFile> = ({
  heading,
  className,
  ...props
}) => (
  <div
    {...props}
    className={ctw(`d-full grid place-content-center rounded-lg bg-gray-50 px-4 py-6`, className)}
  >
    <div className={`mb-40`}>
      <DownloadFileSvg />
      <h4 className={`mb-3.5 text-xs font-bold`}> {heading}</h4>
    </div>
  </div>
);
