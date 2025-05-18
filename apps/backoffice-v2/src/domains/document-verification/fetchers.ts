import { PaginationParams } from '@/common/utils/fetch-all-pages';
import { z } from 'zod';

export const DocumentVerificationStatuses = ['pending', 'verified', 'rejected'] as const;

export const CustomerSchema = z.object({
  name: z.string().optional(),
  displayName: z.string().optional(),
  faviconImageUri: z.string().optional(),
});

export const DocumentVerificationCheckSchema = z.object({
  id: z.string(),
  checkId: z.string(),
  companyName: z.string(),
  merchantId: z.string().optional(),
  email: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  data: z.object({}).optional(),
  documentType: z.string().optional(),
  documentUrl: z.string().optional(),
  documentNames: z.array(z.string()).default([]),
  verificationLink: z.string().optional(),
  status: z.enum(DocumentVerificationStatuses),
  issues: z.array(z.string()).optional(),
  customer: CustomerSchema.optional(),
});

export const DocumentVerificationChecksSchema = z.object({
  data: z.array(DocumentVerificationCheckSchema),
  totalItems: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});

export const DocumentVerificationCheckCreationSchema = z.object({
  checkId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(DocumentVerificationStatuses),
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
export type TDocumentVerificationCheckCreation = z.infer<
  typeof DocumentVerificationCheckCreationSchema
>;

// Helper function to add a small delay for better UX
const addDelay = async <T>(data: T): Promise<T> => {
  // Add a small delay to simulate network latency (300-800ms)
  const delay = Math.floor(Math.random() * 500) + 300;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

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
      companyName: `Company ${index + 1}`,
      merchantId: `merchant-${index + 1}`,
      email: `company${index + 1}@example.com`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: index % 5 === 0 ? new Date() : null,
      data: {},
      documentType: index % 3 === 0 ? 'passport' : index % 3 === 1 ? 'driver_license' : 'id_card',
      documentUrl: `https://example.com/documents/doc-${index}.pdf`,
      documentNames: [`Document ${index + 1}-1.pdf`, `Document ${index + 1}-2.pdf`],
      verificationLink: `https://verification.example.com/doc-link-${index}`,
      status,
      issues: index % 2 === 0 ? [`Issue ${index}`] : [],
      customer: {
        name: `Company ${index + 1}`,
        displayName: `Company ${index + 1}`,
        faviconImageUri: `https://example.com/favicons/company-${index}.png`,
      },
    };
  });

  const response = {
    data: mockData,
    totalItems: 10,
    totalPages: 1,
  };

  // Add a small delay for better UX
  return addDelay(response);
};

export const createDocumentVerificationCheck = async (data: {
  companyName: string;
  merchantId?: string;
  documentFiles: File[];
}): Promise<TDocumentVerificationCheckCreation> => {
  console.log('Creating document verification check:', data);

  // Mock successful response
  const response = {
    checkId: `doc-verification-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'pending' as const,
  };

  // Add a small delay for better UX
  return addDelay(response);
};
