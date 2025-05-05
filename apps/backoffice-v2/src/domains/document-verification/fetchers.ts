import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { z } from 'zod';

export const DocumentVerificationStatuses = ['pending', 'verified', 'rejected'] as const;

export const DocumentVerificationCheckSchema = z.object({
  id: z.string(),
  checkId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  data: z.object({}).optional(),
  documentType: z.string(),
  documentUrl: z.string().optional(),
  verificationLink: z.string(),
  status: z.enum(DocumentVerificationStatuses),
  issues: z.array(z.string()).optional(),
});

export const DocumentVerificationChecksSchema = z.object({
  data: z.array(DocumentVerificationCheckSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});

export interface IDocumentVerificationChecksParams {
  page: number;
  limit?: number;
  status?: string[];
  from?: string;
  to?: string;
}

export type TDocumentVerificationCheck = z.infer<typeof DocumentVerificationCheckSchema>;

export type TDocumentVerificationChecks = z.infer<typeof DocumentVerificationChecksSchema>;

export const fetchDocumentVerificationChecks = async (
  params: IDocumentVerificationChecksParams,
) => {
  // Mock response with 10 items
  const mockData = Array.from({ length: 10 }, (_, index) => {
    // Ensure status is always one of the valid statuses
    const statusOptions = DocumentVerificationStatuses;
    const status = statusOptions[index % statusOptions.length];

    return {
      id: `doc-check-${index + 1}`,
      checkId: `doc-verification-${index + 1}`,
      firstName: `John${index}`,
      lastName: `Doe${index}`,
      email: `john.doe${index}@example.com`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: index % 5 === 0 ? new Date() : null,
      data: {},
      documentType: index % 3 === 0 ? 'passport' : index % 3 === 1 ? 'driver_license' : 'id_card',
      documentUrl: `https://example.com/documents/doc-${index}.pdf`,
      verificationLink: `https://verification.example.com/doc-link-${index}`,
      status,
      issues: index % 2 === 0 ? [`Issue ${index}`] : [],
    };
  });

  return {
    data: mockData,
    totalItems: 10,
    totalPages: 1,
  };
};

export const createDocumentVerificationCheck = async (data: {
  firstName: string;
  lastName: string;
  country: string;
  state?: string;
  dateOfBirth: string;
  documentType: string;
  documentFile?: File;
}) => {
  // In a real implementation, we would upload the file and send the data to the server
  console.log('Creating document verification check:', data);

  // Mock successful response
  return {
    id: `doc-check-${Math.floor(Math.random() * 1000)}`,
    checkId: `doc-verification-${Math.floor(Math.random() * 1000)}`,
    firstName: data.firstName,
    lastName: data.lastName,
    email: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@example.com`,
    createdAt: new Date(),
    updatedAt: new Date(),
    documentType: data.documentType,
    verificationLink: `https://verification.example.com/doc-link-${Math.floor(
      Math.random() * 1000,
    )}`,
    status: 'pending' as const,
  };
};
