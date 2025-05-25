import { ctw, FunctionComponentWithChildren } from '@ballerine/ui';
import { Alert } from '@/common/components/atoms/Alert/Alert';
import { AlertDescription } from '@/common/components/atoms/Alert/Alert.Description';
import { AlertTitle } from '@/common/components/atoms/Alert/Alert.Title';
import { ComponentProps } from 'react';

export const InfoAlert: FunctionComponentWithChildren<ComponentProps<typeof Alert>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Alert
      className={ctw(
        'flex items-center gap-x-2 bg-slate-100 !px-6 py-[0.8132rem] drop-shadow-sm',
        className,
      )}
      {...props}
    >
      <div>
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10.0212" cy="10" r="6" fill="#97A3B6" />
          <path
            d="M8 8.32295C8.16493 7.88032 8.48438 7.50822 8.9025 7.27169C9.32061 7.03517 9.8108 6.94926 10.2874 7.029C10.7639 7.10874 11.1966 7.34904 11.5096 7.7079C11.8227 8.06677 11.9962 8.52136 12 8.99221C12 10.3307 9.93814 11 9.93814 11"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.93335 13.6484H9.94002"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <AlertTitle className={`sr-only`}>Info</AlertTitle>
      <AlertDescription className={`text-sm text-[hsla(0,0%,0%,0.6)]`}>{children}</AlertDescription>
    </Alert>
  );
};
