import { Alert } from '../Alert/Alert';
import { AlertCircle } from 'lucide-react';
import { AlertTitle } from '../Alert/Alert.Title';
import { AlertDescription } from '../Alert/Alert.Description';

interface Props {
  children: React.ReactNode;
}

export const ErrorAlert = ({ children }: Props) => {
  return (
    <div className={`mt-3 mb-1`}>
      <Alert variant={`destructive`} className={`w-full max-w-lg`}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    </div>
  );
};
