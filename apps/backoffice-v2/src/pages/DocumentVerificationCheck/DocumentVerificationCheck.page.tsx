import { FunctionComponent, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Download, File } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@ballerine/ui';
import { Button } from '@/common/components/atoms/Button/Button';
import { useDocumentVerificationChecksQuery } from '@/domains/document-verification/hooks/queries/useDocumentVerificationChecksQuery/useDocumentVerificationChecksQuery';
import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { DocumentVerificationStatuses } from '@/domains/document-verification/fetchers';

type BadgeVariant = 'default' | 'outline' | 'secondary' | 'destructive' | 'success';

export const DocumentVerificationCheck: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const locale = searchParams.get('locale') || 'en';

  const { data: documentsResponse, isLoading } = useDocumentVerificationChecksQuery({
    page: 1,
    limit: 100, // Load more documents to make sure we find the right one
  });

  const document = useMemo(() => {
    if (!documentsResponse?.data || !id) {
      return null;
    }
    return documentsResponse.data.find(doc => doc.id === id);
  }, [documentsResponse, id]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!document) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <File className="h-16 w-16 text-gray-400" />
        <h2 className="text-2xl font-bold">Document not found</h2>
        <p className="text-gray-500">
          The document verification check you're looking for doesn't exist.
        </p>
        <Link to={`/${locale}/document-verification`}>
          <Button>Back to Document Verification</Button>
        </Link>
      </div>
    );
  }

  // Default to 'pending' if status is undefined
  const status = document.status || 'pending';

  const getStatusBadgeVariant = (
    status: (typeof DocumentVerificationStatuses)[number],
  ): BadgeVariant => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'verified':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: (typeof DocumentVerificationStatuses)[number]): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center space-x-4">
        <Link to={`/${locale}/document-verification`} className="text-blue-600 hover:text-blue-800">
          <div className="flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Document Verification
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Document Verification - {document.checkId}</h1>
          <p className="text-gray-500">
            Created on {format(new Date(document.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(status)}>{getStatusLabel(status)}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p>{document.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p>{document.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{document.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Document Type</p>
              <p className="capitalize">{document.documentType.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Document</h2>
          {document.documentUrl ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex h-40 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                <File className="h-16 w-16 text-gray-400" />
              </div>
              <a
                href={document.documentUrl}
                download
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Download className="mr-1 h-4 w-4" />
                Download Document
              </a>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-gray-500">No document available</p>
            </div>
          )}
        </div>
      </div>

      {document.issues && document.issues.length > 0 && (
        <div className="space-y-4 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Issues</h2>
          <ul className="list-inside list-disc space-y-2">
            {document.issues.map((issue, index) => (
              <li key={index} className="text-red-600">
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
