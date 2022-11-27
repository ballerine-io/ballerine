import React, { FunctionComponent, SVGProps } from 'react';

/**
 * @description The chevron svg found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const ChevronDownSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  const { style, ...rest } = props;

  return (
    <svg
      style={{
        width: '100%',
        height: '100%',
        display: 'inline-block',
        ...style,
      }}
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path opacity="0.6" d="M4 6L0.535898 -1.75695e-07L7.4641 4.29987e-07L4 6Z" fill="#4D4D4D" />
    </svg>
  );
};
