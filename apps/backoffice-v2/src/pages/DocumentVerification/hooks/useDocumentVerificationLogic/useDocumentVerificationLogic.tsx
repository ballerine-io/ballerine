import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useDocumentVerificationChecksQuery } from '@/domains/document-verification/hooks/queries/useDocumentVerificationChecksQuery/useDocumentVerificationChecksQuery';
import { DocumentVerificationStatuses } from '@/domains/document-verification/fetchers';

interface Props {
  filters?: Record<string, string[]>;
}

export const useDocumentVerificationLogic = (props?: Props) => {
  const { filters } = props || {};
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState<string>('');
  const page = useMemo(() => {
    return Number(searchParams.get('page') || 1);
  }, [searchParams]);

  const [dates, setDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;
  const firstName = customer?.name || '';
  const fullName = customer?.displayName || '';
  const avatarUrl = customer?.faviconImageUri || '';
  const locale = searchParams.get('locale') || 'en';

  const [open, setOpen] = useState(false);
  const toggleOpen = (val?: boolean) => {
    setOpen(prev => (val !== undefined ? val : !prev));
  };

  // Filter states
  const status = useMemo(() => {
    return searchParams.getAll('status');
  }, [searchParams]);

  const {
    data: documentVerificationChecksResponse,
    isLoading: isLoadingDocumentVerificationChecks,
  } = useDocumentVerificationChecksQuery({
    page,
    limit: 10,
    status,
    from: dates.from ? dates.from.toISOString() : undefined,
    to: dates.to ? dates.to.toISOString() : undefined,
  });

  const documentVerificationChecks = useMemo(() => {
    return documentVerificationChecksResponse?.data || [];
  }, [documentVerificationChecksResponse]);

  const totalPages = useMemo(() => {
    return documentVerificationChecksResponse?.totalPages || 0;
  }, [documentVerificationChecksResponse]);

  const totalItems = useMemo(() => {
    return documentVerificationChecksResponse?.totalItems || 0;
  }, [documentVerificationChecksResponse]);

  const isLastPage = useMemo(() => {
    return page >= totalPages;
  }, [page, totalPages]);

  const onSearch = (newSearch: string) => {
    setSearch(newSearch);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    setSearchParams(params);
  };

  const onDatesChange = (newDates: { from: Date | undefined; to: Date | undefined }) => {
    setDates(newDates);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    setSearchParams(params);
  };

  const onPrevPage = (): string => {
    if (page > 1) {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(page - 1));
      return params.toString();
    }
    return searchParams.toString();
  };

  const onNextPage = (): string => {
    if (!isLastPage) {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(page + 1));
      return params.toString();
    }
    return searchParams.toString();
  };

  const onLastPage = (): string => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(totalPages));
    return params.toString();
  };

  const onPaginate = (newPage: number): string => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    return params.toString();
  };

  const updateUrlSearchParams = (params: Record<string, any>) => {
    const urlSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        urlSearchParams.delete(key);
        value.forEach(item => {
          urlSearchParams.append(key, String(item));
        });
      } else if (value === undefined || value === null || value === '') {
        urlSearchParams.delete(key);
      } else {
        urlSearchParams.set(key, String(value));
      }
    });

    setSearchParams(urlSearchParams);
  };

  const handleFilterChange = (key: string, value: string[]) => {
    updateUrlSearchParams({ [key]: value, page: 1 });
  };

  const handleFilterClear = (key: string) => {
    updateUrlSearchParams({ [key]: [], page: 1 });
  };

  const onClearAllFilters = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    setSearchParams(params);
    setDates({ from: undefined, to: undefined });
  };

  const isClearAllButtonVisible = useMemo(() => {
    return status.length > 0 || dates.from || dates.to;
  }, [status, dates.from, dates.to]);

  const multiselectProps = useMemo(
    () => ({
      status: {
        options: DocumentVerificationStatuses.map(status => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
        })),
        value: status,
      },
    }),
    [status],
  );

  const createDocumentReport = {
    enabled: true,
  };

  const createDocumentReportBatch = {
    enabled: false,
  };

  return {
    documentVerificationChecks,
    isLoadingDocumentVerificationChecks,
    search,
    onSearch,
    totalPages,
    totalItems,
    page,
    onPrevPage,
    onNextPage,
    onLastPage,
    onPaginate,
    isLastPage,
    dates,
    onDatesChange,
    locale,
    createDocumentReport,
    createDocumentReportBatch,
    onClearAllFilters,
    handleFilterChange,
    handleFilterClear,
    multiselectProps,
    isClearAllButtonVisible,
    firstName,
    fullName,
    avatarUrl,
    open,
    toggleOpen,
    isDemoAccount,
  };
};
