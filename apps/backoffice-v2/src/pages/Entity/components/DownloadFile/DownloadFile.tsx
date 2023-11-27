import { ctw } from '@/common/utils/ctw/ctw';
import React, { ComponentProps, FunctionComponent } from 'react';
import { buttonVariants } from '@/common/components/atoms/Button/Button';

export interface IDownloadFile {
  value: {
    heading: string;
    href: string;
    callToAction: string;
    props?: ComponentProps<'div'>;
    linkProps?: ComponentProps<'a'>;
  };
}

export const DownloadFile: FunctionComponent<IDownloadFile> = ({ value }) => (
  <div
    {...value?.props}
    className={ctw(
      `flex max-w-lg flex-col items-center rounded-md bg-gray-50 px-4 py-6`,
      value?.props?.className,
    )}
  >
    <svg
      width="80"
      height="92"
      viewBox="0 0 80 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mb-2.5`}
    >
      <circle cx="39" cy="53" r="39" fill="#D9D9D9" />
      <path
        d="M6 37C6 35.3431 7.34315 34 9 34H68C69.6569 34 71 35.3431 71 37V82C71 83.6569 69.6569 85 68 85H9C7.34315 85 6 83.6569 6 82V37Z"
        fill="#D9D9D9"
        stroke="#9B9B9B"
        strokeWidth="2"
      />
      <path
        d="M46 1L48.5 1.5L57 9L65 16.5L66 19H50C47.7909 19 46 17.2091 46 15V1Z"
        fill="#B8B8B8"
        fillOpacity="0.6"
      />
      <path
        d="M11 5C11 2.79086 12.7909 1 15 1H46.4717C47.4559 1 48.4055 1.36281 49.1389 2.01903L57.5 9.5L64.7415 16.3155C65.5446 17.0714 66 18.1254 66 19.2283V61.5C66 63.7091 64.2091 65.5 62 65.5H15C12.7909 65.5 11 63.7091 11 61.5V5Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14.961 43.3841C15.2524 41.9949 16.4776 41 17.8971 41H46.6816C47.3157 41 47.9335 41.2009 48.4462 41.5739L52.4826 44.5096L53.0708 43.7009L52.4826 44.5096C53.3373 45.1312 54.3668 45.466 55.4236 45.466H62.4561H75.1177C77.0116 45.466 78.4317 47.1993 78.0591 49.0562L71.3309 82.5902C71.0497 83.9916 69.8189 85 68.3895 85H9.92611C8.02149 85 6.599 83.2482 6.99001 81.3841L14.961 43.3841Z"
        fill="white"
        stroke="#9B9B9B"
        strokeWidth="2"
      />
      <path
        d="M60 18.5V34C60 35.1046 59.1046 36 58 36H19C17.8954 36 17 35.1046 17 34V17C17 15.8954 17.8954 15 19 15L46 15"
        stroke="#9B9B9B"
        strokeWidth="2"
      />
      <path d="M18 22H59" stroke="#9B9B9B" strokeWidth="2" />
      <path d="M18 29H59" stroke="#9B9B9B" strokeWidth="2" />
      <path d="M28 16L28 35" stroke="#9B9B9B" strokeWidth="2" />
      <path d="M39 16L39 35" stroke="#9B9B9B" strokeWidth="2" />
      <path d="M49 18L49 35" stroke="#9B9B9B" strokeWidth="2" />
      <path
        d="M46 5V14C46 16.2091 47.7909 18 50 18H62"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <h4 className={`mb-3.5 font-bold`}> {value?.heading}</h4>
    <a
      href={value?.href}
      download={value?.heading}
      target={'_blank'}
      rel={'noopener noreferrer'}
      {...value?.linkProps}
      className={buttonVariants({
        className: ctw(`!px-6 !font-bold`, value?.linkProps?.className),
      })}
    >
      {value?.callToAction}
    </a>
  </div>
);
