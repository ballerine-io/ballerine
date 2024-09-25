import React, { ComponentProps, FunctionComponent } from 'react';
import { ctw } from '@/common';

export const WarningFilledSvg: FunctionComponent<ComponentProps<'svg'>> = props => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={ctw('text-[#FFB35A]', props.className)}
    >
      <path
        d="M6.74033 2.18182C7.30018 1.21212 8.69982 1.21212 9.25967 2.18182L13.6685 9.81818C14.2284 10.7879 13.5286 12 12.4089 12H3.59114C2.47143 12 1.77162 10.7879 2.33147 9.81818L6.74033 2.18182Z"
        fill="currentColor"
      />
      <path
        d="M8 4.36328V7.27237"
        stroke="#FFF0DE"
        strokeWidth="1.45455"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 9.45508V9.81871"
        stroke="#FFF0DE"
        strokeWidth="1.45455"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
