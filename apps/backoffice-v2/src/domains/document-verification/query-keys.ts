import { fetchDocumentVerificationChecks, IDocumentVerificationChecksParams } from './fetchers';

export const documentVerificationChecksQueryKey = {
  all: ['document-verification-checks'],
  list: (params: IDocumentVerificationChecksParams) => ({
    queryKey: [...documentVerificationChecksQueryKey.all, params],
    queryFn: () => fetchDocumentVerificationChecks(params),
  }),
  detail: (id: string) => ({
    queryKey: [...documentVerificationChecksQueryKey.all, id],
  }),
};
