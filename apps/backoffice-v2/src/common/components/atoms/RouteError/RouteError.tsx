import { Alert } from '../Alert/Alert';
import { AlertCircle } from 'lucide-react';
import { AlertTitle } from '../Alert/Alert.Title';
import { AlertDescription } from '../Alert/Alert.Description';
import { useRouteError } from 'react-router-dom';
import { isErrorWithMessage } from '@ballerine/common';

export const RouteError = () => {
  const error = useRouteError();

  return (
    <div className={`mt-3 p-1`}>
      <Alert variant={`destructive`} className={`w-full max-w-lg`}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {isErrorWithMessage(error) ? error.message : 'Something went wrong.'}
        </AlertDescription>
      </Alert>
    </div>
  );
};
