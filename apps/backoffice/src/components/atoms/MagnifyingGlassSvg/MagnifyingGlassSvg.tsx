import { FunctionComponent, SVGProps } from 'react';

/**
 * @description The magnifying glass svg found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const MagnifyingGlassSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  const { style, ...rest } = props;

  return (
    <svg
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'inline-block',
        width: '100%',
        height: '100%',
        ...style,
      }}
      {...rest}
    >
      <circle
        cx="6.8"
        cy="6.8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2002 11.1992L16.0002 15.9992"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
