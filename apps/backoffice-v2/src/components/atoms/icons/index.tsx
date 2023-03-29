import { FunctionComponent, SVGProps } from 'react';
import { ctw } from '@/utils/ctw/ctw';

/**
 * @description The Ballerine logo SVG found in Ballerine's Figma design.
 * @param props
 * @constructor
 */
export const BallerineLogo: FunctionComponent<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      width="19"
      height="33"
      viewBox="0 0 19 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.088092 13.1234V12.0319L0.199311 10.6973C0.325361 9.18467 0.647698 7.6949 1.1582 6.26549L1.22624 6.07499C2.70558 1.93284 6.92211 -0.571319 11.2671 0.111791L11.4628 0.142556C15.4454 0.768686 18.3798 4.20042 18.3798 8.23194C18.3798 11.4647 16.8812 14.3474 14.5407 16.2233C14.4048 16.3323 14.3832 16.5325 14.4925 16.6682C16.1368 18.7092 16.9495 21.4261 16.4615 24.2588C15.7655 28.2989 12.5504 31.4415 8.49435 32.0372L4.95501 32.5569C4.69638 32.5949 4.43978 32.4762 4.30123 32.2546C1.50004 27.7727 0.0300325 22.5871 0.0624569 17.3019L0 15.2126L0.088092 13.1234ZM10.4371 5.39143L10.6328 5.42219C12.0161 5.63967 13.0353 6.83164 13.0353 8.23194C13.0353 10.9334 10.8453 13.1234 8.14386 13.1234H5.73368C5.56738 13.1234 5.43258 12.9886 5.43258 12.8223V12.2542L5.52533 11.1411C5.61288 10.0905 5.83676 9.05583 6.19133 8.06303L6.25936 7.87254C6.87487 6.14911 8.62925 5.1072 10.4371 5.39143ZM7.09283 18.4679H5.43258C5.43028 18.4679 5.42846 18.4698 5.42856 18.4721C5.55296 21.2772 6.20008 24.0285 7.33021 26.5859C7.38445 26.7086 7.51431 26.7793 7.64709 26.7598L7.71782 26.7494C9.48249 26.4903 10.8901 25.1191 11.1946 23.3515C11.6347 20.7968 9.66548 18.4679 7.09283 18.4679Z"
        className={`fill-primary`}
      />
    </svg>
  );
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className={ctw('h-6 w-6', className)}
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className={ctw(`h-6 w-6`, className)}
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
      className="h-6 w-6"
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
