import React, { FunctionComponent, SVGProps } from 'react';

/**
 * @description The warning svg found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const WarningSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.26795 3C10.0377 1.66667 11.9623 1.66667 12.7321 3L18.7942 13.5C19.564 14.8333 18.6018 16.5 17.0622 16.5H4.93782C3.39822 16.5 2.43597 14.8333 3.20577 13.5L9.26795 3Z"
        fill="#FFB35A"
      />
      <path d="M11 6V10" stroke="#FFF0DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 13V13.5" stroke="#FFF0DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
