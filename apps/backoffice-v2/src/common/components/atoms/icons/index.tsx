import { ComponentProps, ComponentPropsWithoutRef, FunctionComponent, SVGProps } from 'react';
import { env } from '@/common/env/env';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description MiKashBoks logo asset.
 * @param props
 * @constructor
 */
export const MiKashBoksLogo: FunctionComponent<ComponentPropsWithoutRef<'img'>> = props => {
  const src = env.VITE_IMAGE_LOGO_URL || '/images/mikashboks-logo-horizontal.svg';

  return <img src={src} alt="MiKashBoks" {...props} />;
};

/**
 * @description The home SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const HomeSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
};

/**
 * @description The checked checkbox SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const CheckedSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
      />
    </svg>
  );
};

/**
 * @description The cog (settings) SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const CogSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
};

/**
 * @description The log out SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const LogOutSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        opacity="0.5"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.56185 2.5C8.56185 2.36193 8.44992 2.25 8.31185 2.25L1.97852 2.25C1.84044 2.25 1.72852 2.36193 1.72852 2.5L1.72852 11.5C1.72852 11.6381 1.84044 11.75 1.97851 11.75H8.31185C8.44992 11.75 8.56185 11.6381 8.56185 11.5V10.5C8.56185 10.0858 8.89763 9.75 9.31185 9.75C9.72606 9.75 10.0618 10.0858 10.0618 10.5V11.5C10.0618 12.4665 9.27835 13.25 8.31185 13.25H1.97851C1.01202 13.25 0.228516 12.4665 0.228516 11.5V2.5C0.228516 1.5335 1.01202 0.75 1.97852 0.75H8.31185C9.27835 0.75 10.0618 1.5335 10.0618 2.5V3.5C10.0618 3.91421 9.72606 4.25 9.31185 4.25C8.89763 4.25 8.56185 3.91421 8.56185 3.5V2.5ZM8.06879 7C8.06879 6.60113 8.39214 6.27778 8.79102 6.27778H12.2042L11.4159 5.521C11.1281 5.24477 11.1188 4.78758 11.395 4.49984C11.6712 4.2121 12.1284 4.20277 12.4162 4.479L14.4995 6.479C14.6414 6.61519 14.7216 6.80334 14.7216 7C14.7216 7.19666 14.6414 7.38481 14.4995 7.521L12.4162 9.521C12.1284 9.79723 11.6712 9.7879 11.395 9.50016C11.1188 9.21242 11.1281 8.75523 11.4159 8.479L12.2042 7.72222H8.79102C8.39214 7.72222 8.06879 7.39887 8.06879 7Z"
        fill="black"
      />
    </svg>
  );
};

/**
 * @description The magnifying glass SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const MagnifyingGlassSvg: FunctionComponent<SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={ctw('d-6', className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
        clipRule="evenodd"
      />
    </svg>
  );
};

/**
 * @description The filter SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const FilterSvg: FunctionComponent<SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={ctw('d-6', className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
      />
    </svg>
  );
};

/**
 * @description The sort SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const SortSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      width="11"
      height="12"
      viewBox="0 0 11 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6771 9.23291C10.9592 8.95087 10.9592 8.49358 10.6771 8.21153C10.3951 7.92949 9.93781 7.92949 9.65576 8.21153L8.88867 8.97862L8.88867 4.72222C8.88867 4.32335 8.56532 4 8.16645 4C7.76758 4 7.44423 4.32335 7.44423 4.72222L7.44423 8.97862L6.67714 8.21153C6.39509 7.92949 5.93781 7.92949 5.65576 8.21153C5.37372 8.49358 5.37372 8.95087 5.65576 9.23291L7.65576 11.2329C7.93781 11.515 8.39509 11.515 8.67714 11.2329L10.6771 9.23291Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.211534 2.2124C-0.0705113 2.49445 -0.0705113 2.95173 0.211534 3.23378C0.493579 3.51582 0.950865 3.51582 1.23291 3.23378L2 2.46669L2 6.72309C2 7.12196 2.32335 7.44531 2.72222 7.44531C3.12109 7.44531 3.44444 7.12196 3.44444 6.72309L3.44444 2.46669L4.21153 3.23378C4.49358 3.51582 4.95087 3.51582 5.23291 3.23378C5.51496 2.95173 5.51496 2.49445 5.23291 2.2124L3.23291 0.212402C2.95087 -0.069643 2.49358 -0.069643 2.21153 0.212402L0.211534 2.2124Z"
        fill="currentColor"
      />
    </svg>
  );
};

/**
 * @description The rejected SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const RejectedSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
        clipRule="evenodd"
      />
    </svg>
  );
};

/**
 * @description The approved SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const ApprovedSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
};

/**
 * @description The chevron SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const ChevronDownSvg: FunctionComponent<SVGProps<SVGSVGElement>> = ({
  className,
  ...rest
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={ctw('size-6', className)}
      {...rest}
    >
      <path
        fillRule="evenodd"
        d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
};

/**
 * @description The warning SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const WarningSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
};

/**
 * @description An SVG of an 'X' from Heroicons.
 *
 * @see {@link https://heroicons.com/|Heroicons}
 */
export const XMarkSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};

/**
 * @description The ellipsis SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const EllipsisSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      width="3"
      height="17"
      viewBox="0 0 3 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
      <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
    </svg>
  );
};

/**
 * @description A chevron left SVG from Heroicons.
 *
 * @see {@link https://heroicons.com/|Heroicons}
 */
export const ChevronLeftSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
};

/**
 * @description A chevron right SVG from Heroicons.
 *
 * @see {@link https://heroicons.com/|Heroicons}
 */
export const ChevronRightSvg: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
};

/**
 * @description An SVG of a checkmark from Heroicons.
 *
 * @see {@link https://heroicons.com/|Heroicons}
 */
export const CheckSvg: FunctionComponent<SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={ctw(`size-6`, className)}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
};

export const PhotoSvg = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const NoCasesSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 81" fill="none" {...props}>
    <circle cx="45.8955" cy="42" r="39" fill="#D9D9D9" />
    <path
      d="M64.9549 27.3496H25.8361C23.9378 27.3496 22.1013 28.0247 20.6549 29.2541L2.89551 44.3496V67.5H87.8955V44.3496L70.1361 29.2541C68.6897 28.0247 66.8532 27.3496 64.9549 27.3496Z"
      fill="#E7E7E7"
    />
    <path
      d="M87.8955 44.3496L70.1361 29.2541C68.6897 28.0247 66.8532 27.3496 64.9549 27.3496H25.8361C23.9378 27.3496 22.1013 28.0247 20.6549 29.2541L2.89551 44.3496"
      stroke="black"
      strokeWidth="2"
    />
    <path
      d="M1.89551 47C1.89551 44.7909 3.68637 43 5.89551 43H18.1336C21.028 43 23.7804 44.2541 25.6796 46.4382L29.1022 50.3741C31.3813 52.9951 34.6842 54.5 38.1574 54.5H52.6336C56.1068 54.5 59.4097 52.9951 61.6888 50.3741L65.1114 46.4382C67.0106 44.2541 69.763 43 72.6574 43H84.8955C87.1046 43 88.8955 44.7909 88.8955 47V64C88.8955 66.2091 87.1046 68 84.8955 68H5.89551C3.68637 68 1.89551 66.2091 1.89551 64V47Z"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
    <path
      d="M73.8955 38C81.1492 36.6795 90.4869 28.6125 85.2113 20.2091C81.1492 13.7387 71.7109 17.4116 75.9266 24.0326C79.1106 29.0334 88.9059 25.3056 90.6338 17.1607M89.2736 8C89.5981 8.67957 89.8695 9.34662 90.0916 10M90.7924 13C90.8134 13.1679 90.8311 13.3345 90.8455 13.5"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="86.2744"
      cy="3.41506"
      r="2.5"
      transform="rotate(-30 86.2744 3.41506)"
      fill="black"
    />
    <ellipse cx="91.6045" cy="2.64648" rx="3.5" ry="1.5" fill="black" />
    <ellipse
      cx="82.9445"
      cy="7.64665"
      rx="3.5"
      ry="1.5"
      transform="rotate(-60 82.9445 7.64665)"
      fill="black"
    />
  </svg>
);

export const NoTasksSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="80"
    height="92"
    viewBox="0 0 80 92"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="39" cy="53" r="39" fill="#D9D9D9" />
    <path
      d="M6 37C6 35.3431 7.34315 34 9 34H68C69.6569 34 71 35.3431 71 37V82C71 83.6569 69.6569 85 68 85H9C7.34315 85 6 83.6569 6 82V37Z"
      fill="#D9D9D9"
      stroke="black"
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
      fillOpacity="0.6"
      stroke="#9B9B9B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 8"
    />
    <path
      d="M46 4.5V15C46 17.2091 47.7909 19 50 19H62.5"
      stroke="#9B9B9B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 8"
    />
    <path
      d="M14.9839 41.4088C15.2655 40.0079 16.4961 39 17.925 39H46.6364C47.2914 39 47.9284 39.2143 48.4501 39.6103L52.4461 42.643C53.3156 43.303 54.3772 43.6602 55.4688 43.6602H62.4561H75.1576C77.0417 43.6602 78.4594 45.3765 78.1036 47.2267L71.3085 82.5665C71.0369 83.979 69.8009 85 68.3625 85H9.88411C7.98977 85 6.56961 83.2659 6.94295 81.4088L14.9839 41.4088Z"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
  </svg>
);

export const DoubleCaretSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 7.00293L3 9.00293L1 7.00293"
      stroke="#A3A3A3"
      strokeWidth="1.44444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 3L3 1L5 3"
      stroke="#A3A3A3"
      strokeWidth="1.44444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UnassignedAvatarSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="#E4E4E7" strokeWidth="2" />
    <path
      d="M16.8285 16.9763C17.5786 17.6014 18 18.4493 18 19.3333C13.6001 22.8 8.1667 20.7778 6 19.3333C6 18.4493 6.42143 17.6014 7.17158 16.9763C7.92173 16.3512 8.93915 16 10 16H14C15.0609 16 16.0783 16.3512 16.8285 16.9763Z"
      fill="#E4E4E7"
      stroke="#E4E4E7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z"
      fill="#E4E4E7"
    />
  </svg>
);

export const CopySvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_12422_26452)">
      <path
        d="M2.66659 10.6668C1.93325 10.6668 1.33325 10.0668 1.33325 9.3335V2.66683C1.33325 1.9335 1.93325 1.3335 2.66659 1.3335H9.33325C10.0666 1.3335 10.6666 1.9335 10.6666 2.66683M6.66658 5.3335H13.3333C14.0696 5.3335 14.6666 5.93045 14.6666 6.66683V13.3335C14.6666 14.0699 14.0696 14.6668 13.3333 14.6668H6.66658C5.93021 14.6668 5.33325 14.0699 5.33325 13.3335V6.66683C5.33325 5.93045 5.93021 5.3335 6.66658 5.3335Z"
        stroke="#787981"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_12422_26452">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const DownloadFileSvg: FunctionComponent<ComponentProps<'svg'>> = props => (
  <svg
    width="80"
    height="92"
    viewBox="0 0 80 92"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mb-2.5`}
    {...props}
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
);

export const NoIndividualsSvg: FunctionComponent<ComponentProps<'svg'>> = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="79" viewBox="0 0 80 79" fill="none">
      <circle cx="39" cy="40" r="39" fill="#D9D9D9" />
      <path
        d="M9 24H68C69.6569 24 71 25.3431 71 27V72C71 73.6569 69.6569 75 68 75H9C7.34315 75 6 73.6569 6 72V27C6 25.3431 7.34315 24 9 24Z"
        fill="#D9D9D9"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M68 39V33.6667C68 31.8986 67.2475 30.2029 65.9079 28.9526C64.5684 27.7024 62.7515 27 60.8571 27H50.1429C48.2485 27 46.4316 27.7024 45.0921 28.9526C43.7525 30.2029 43 31.8986 43 33.6667V39"
        fill="white"
        fillOpacity="0.3"
      />
      <path
        d="M68 39V33.6667C68 31.8986 67.2475 30.2029 65.9079 28.9526C64.5684 27.7024 62.7515 27 60.8571 27H50.1429C48.2485 27 46.4316 27.7024 45.0921 28.9526C43.7525 30.2029 43 31.8986 43 33.6667V39"
        stroke="#9B9B9B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4"
      />
      <path
        d="M48 30V26.6667C48 24.8986 47.2475 23.2029 45.9079 21.9526C44.5684 20.7024 42.7515 20 40.8571 20H30.1429C28.2485 20 26.4316 20.7024 25.0921 21.9526C23.7525 23.2029 23 24.8986 23 26.6667V30"
        fill="white"
        fillOpacity="0.6"
      />
      <path
        d="M48 30V26.6667C48 24.8986 47.2475 23.2029 45.9079 21.9526C44.5684 20.7024 42.7515 20 40.8571 20H30.1429C28.2485 20 26.4316 20.7024 25.0921 21.9526C23.7525 23.2029 23 24.8986 23 26.6667V30"
        stroke="#9B9B9B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4"
      />
      <path
        d="M55.5 23C59.6421 23 63 19.6421 63 15.5C63 11.3579 59.6421 8 55.5 8C51.3579 8 48 11.3579 48 15.5C48 19.6421 51.3579 23 55.5 23Z"
        fill="white"
        fillOpacity="0.3"
        stroke="#9B9B9B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 4"
      />
      <path
        d="M35.5 16C39.6421 16 43 12.6421 43 8.5C43 4.35786 39.6421 1 35.5 1C31.3579 1 28 4.35786 28 8.5C28 12.6421 31.3579 16 35.5 16Z"
        fill="white"
        fillOpacity="0.6"
        stroke="#9B9B9B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 4"
      />
      <path
        d="M17.9248 29H46.6367C47.2097 29.0001 47.7687 29.1645 48.249 29.4707L48.4502 29.6104L52.4463 32.6426C53.3158 33.3025 54.3772 33.6601 55.4688 33.6602H75.1572C76.9824 33.6602 78.3704 35.2709 78.1318 37.0537L78.1035 37.2266L71.3086 72.5664C71.037 73.979 69.8007 75 68.3623 75H9.88379C8.04866 74.9998 6.6585 73.3723 6.91309 71.582L6.94336 71.4092L14.9834 31.4092C15.265 30.0083 16.496 29.0001 17.9248 29Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};
