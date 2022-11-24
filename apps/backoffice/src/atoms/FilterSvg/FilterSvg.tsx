import React, { FunctionComponent, SVGProps } from 'react';

export const FilterSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  const { style, ...rest } = props;

  return (
    <svg
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '1rem',
        height: '1rem',
        ...style,
      }}
      {...rest}
    >
      <path
        d="M7.44852 11.0875C7.24649 11.8283 6.31958 12.0745 5.77664 11.5315L5.23082 10.9857C5.07782 10.8327 4.97858 10.6342 4.94798 10.42L4.52144 7.43424C4.50404 7.31246 4.46432 7.19493 4.40428 7.08756L1.83206 2.4881C1.45929 1.82153 1.94112 0.999999 2.70485 0.999999L10.2853 1C11.049 1 11.5308 1.82151 11.1581 2.48808L8.55487 7.14314C8.51518 7.21412 8.4843 7.28966 8.4629 7.36811L7.44852 11.0875Z"
        stroke="#A6A6A6"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};
