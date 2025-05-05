import { FunctionComponent } from 'react';
import { File } from 'lucide-react';

export const NoDocumentVerificationChecks: FunctionComponent = () => {
  return (
    <div className="flex h-80 w-full flex-col items-center justify-center space-y-2">
      <File className="h-12 w-12 text-gray-400" />
      <div className="text-center">
        <p className="font-semibold text-gray-700">No Document Verification Cases Found</p>
        <p className="text-gray-500">Try adjusting your filters or create a new case.</p>
      </div>
    </div>
  );
};
