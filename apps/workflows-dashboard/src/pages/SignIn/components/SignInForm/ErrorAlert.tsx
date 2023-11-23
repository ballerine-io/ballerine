import { ErrorAlert } from '@/components/atoms/ErrorAlert/ErrorAlert';

interface Props {
  errorCode: number;
}

const getErrorMessageByErrorCode = (code: number) => {
  const defaultMessage = `Something went wrong. Try again later.`;

  const codeToMessageMap: Record<number, string> = {
    [401]: 'Invalid credentials',
  };

  return codeToMessageMap[code] || defaultMessage;
};

export function FormErrorAlert({ errorCode }: Props) {
  return <ErrorAlert>{getErrorMessageByErrorCode(errorCode)}</ErrorAlert>;
}

FormErrorAlert.displayName = 'FormErrorAlert';
