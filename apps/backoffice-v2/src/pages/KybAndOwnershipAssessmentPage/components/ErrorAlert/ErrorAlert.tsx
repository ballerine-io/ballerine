import { ctw, FunctionComponentWithChildren } from '@ballerine/ui';
import { Alert } from '@/common/components/atoms/Alert/Alert';
import { AlertDescription } from '@/common/components/atoms/Alert/Alert.Description';
import { AlertTitle } from '@/common/components/atoms/Alert/Alert.Title';
import { ComponentProps } from 'react';

export const ErrorAlert: FunctionComponentWithChildren<ComponentProps<typeof Alert>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Alert
      className={ctw('flex items-center gap-x-2 bg-destructive/20 !px-6 py-[0.8132rem]', className)}
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
          <circle cx="10.0215" cy="10" r="6" fill="#DF2222" />
          <path
            d="M8.17188 12.2904L12.0228 8.43945"
            stroke="white"
            stroke-width="1.10026"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.17155 8.43945L12.0225 12.2904"
            stroke="white"
            stroke-width="1.10026"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <AlertTitle className={`sr-only`}>Error</AlertTitle>
      <AlertDescription className={`text-sm text-[hsla(0,0%,0%,0.6)]`}>{children}</AlertDescription>
    </Alert>
  );
};
