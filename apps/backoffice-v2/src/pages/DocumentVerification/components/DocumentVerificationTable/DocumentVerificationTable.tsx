import { FunctionComponent, useMemo } from 'react';
import { format } from 'date-fns';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { TDocumentVerificationCheck } from '@/domains/document-verification/fetchers';
import { Badge } from '@ballerine/ui';
import { ExternalLink } from 'lucide-react';
import { getStatusLabel } from './utils/getStatusLabel';
import { getStatusVariant } from './utils/getStatusVariant';

interface IdentityVerificationTableProps {
  data: TDocumentVerificationCheck[];
  isDemoAccount?: boolean;
}

export const DocumentVerificationTable: FunctionComponent<IdentityVerificationTableProps> = ({
  data,
  isDemoAccount,
}) => {
  const [searchParams] = useSearchParams();
  const locale = searchParams.get('locale') || 'en';

  const documents = useMemo(() => {
    return data.map(document => ({
      ...document,
      formattedDate: format(document.createdAt, 'MMM d, yyyy'),
      statusLabel: getStatusLabel(document.status),
      statusVariant: getStatusVariant(document.status),
    }));
  }, [data]);

  return (
    <div className={`rounded-md border border-gray-200`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map(document => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.checkId}</TableCell>
              <TableCell>
                {document.firstName} {document.lastName}
              </TableCell>
              <TableCell className="capitalize">
                {document.documentType.replace('_', ' ')}
              </TableCell>
              <TableCell>{document.formattedDate}</TableCell>
              <TableCell>
                <Badge variant={document.statusVariant}>{document.statusLabel}</Badge>
              </TableCell>
              <TableCell className="flex items-center space-x-2">
                <Link
                  to={`/${locale}/document-verification/${document.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
                {!isDemoAccount && (
                  <a
                    href={document.verificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
