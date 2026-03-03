import dayjs from 'dayjs';
import { SlidersHorizontal } from 'lucide-react';
import { ComponentProps, useCallback, useMemo } from 'react';

import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { IS_ALERT_TO_DISPLAY_TEXT } from '@/pages/MerchantMonitoring/schemas';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { getDemoStateErrorText } from '@/common/components/molecules/DemoAccessCards/getDemoStateErrorText';
import { IdentityVerificationSearchSchema } from '../../schemas';
import { useIdentityVerificationAssessmentsQuery } from '@/domains/assessments/hooks/queries/useIdentityVerificationAssessmentsQuery/useIdentityVerificationAssessmentsQuery';

export const useIdentityVerificationLogic = () => {
  const locale = useLocale();
  const { data: customer } = useCustomerQuery();

  const demoError = customer?.config?.demoAccessDetails
    ? getDemoStateErrorText({
        reportsLeft: customer.config.demoAccessDetails.reportsLeft,
        demoDaysLeft: customer.config.demoAccessDetails.demoDaysLeft,
      })
    : null;
  const isIdentityVerificationEnabled = !!customer?.config?.createIdentityVerification;
  const createBusinessReport = {
    ...customer?.features?.createBusinessReport,
    enabled: isIdentityVerificationEnabled && !demoError,
  };
  const createBusinessReportBatch = {
    ...customer?.features?.createBusinessReportBatch,
    enabled: false,
  };

  const { data: session } = useAuthenticatedUserQuery();
  const { firstName, fullName, avatarUrl } = session?.user || {};

  const { search, onSearch } = useSearch();

  const [
    { page, pageSize, from, to, isCreating, workflowRuntimeDataId, entityId },
    setSearchParams,
  ] = useZodSearchParams(IdentityVerificationSearchSchema, { replace: true });

  const open = isCreating ?? false;
  const toggleOpen = (value?: boolean) => setSearchParams({ isCreating: value });

  const reportQuery = {
    page: {
      number: page,
      size: pageSize,
    },
    from,
    to,
    workflowRuntimeDataId,
    entityId,
  };

  const { data, isLoading: isLoadingIdentityVerificationChecks } =
    useIdentityVerificationAssessmentsQuery(reportQuery);

  const isClearAllButtonVisible = useMemo(
    () => !!(search !== '' || from || to || workflowRuntimeDataId || entityId),
    [entityId, from, search, to, workflowRuntimeDataId],
  );

  const handleFilterChange = useCallback(
    (filterKey: string) => (selected: unknown) => {
      setSearchParams({
        [filterKey]: Array.isArray(selected) ? selected : [selected],
        page: '1',
      });
    },
    [setSearchParams],
  );

  const handleFilterClear = useCallback(
    (filterKey: string) => () => {
      setSearchParams({
        [filterKey]: [],
        page: '1',
      });
    },
    [setSearchParams],
  );

  const onClearAllFilters = useCallback(() => {
    setSearchParams({
      reportType: 'All',
      riskLevels: [],
      statuses: [],
      findings: [],
      from: undefined,
      to: undefined,
      workflowRuntimeDataId: undefined,
      entityId: undefined,
      isAlert: 'All',
      page: '1',
    });

    onSearch('');
  }, [onSearch, setSearchParams]);

  const { onPaginate, onPrevPage, onNextPage, onLastPage, isLastPage } = usePagination({
    totalPages: data?.totalPages ?? 0,
  });

  const dates = useMemo(
    () => ({
      from: from ? dayjs(from).toDate() : undefined,
      to: to ? dayjs(to).toDate() : undefined,
    }),
    [from, to],
  );

  const onDatesChange: ComponentProps<typeof DateRangePicker>['onChange'] = range => {
    const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
    const to = range?.to ? dayjs(range?.to).format('YYYY-MM-DD') : undefined;

    setSearchParams({ from, to, allowAllDates: !from && !to });
  };

  const multiselectProps = useMemo(
    () => ({
      trigger: {
        leftIcon: <SlidersHorizontal className="mr-2 size-4" />,
        title: {
          className: `font-normal text-sm`,
        },
      },
    }),
    [],
  );

  return {
    totalPages: data?.totalPages || 0,
    totalItems: Intl.NumberFormat(locale).format(data?.totalItems || 0),
    createBusinessReport,
    createBusinessReportBatch,
    identityVerificationChecks: data?.data || [],
    isLoadingIdentityVerificationChecks,
    isClearAllButtonVisible,
    search,
    onSearch,
    page,
    onPrevPage,
    onNextPage,
    onLastPage,
    onPaginate,
    isLastPage,
    locale,
    multiselectProps,
    handleFilterChange,
    handleFilterClear,
    IS_ALERT_TO_DISPLAY_TEXT,
    dates,
    onDatesChange,
    onClearAllFilters,
    firstName,
    fullName,
    avatarUrl,
    open,
    toggleOpen,
    isDemoAccount: customer?.config?.isDemoAccount ?? false,
  };
};
