import { isNonEmptyArray } from '@ballerine/common';
import { Badge, Skeleton } from '@ballerine/ui';
import { Layers, Loader2, Plus } from 'lucide-react';
import { FunctionComponent, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Button, buttonVariants } from '@/common/components/atoms/Button/Button';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { Search } from '@/common/components/molecules/Search';
import { UrlPagination } from '@/common/components/molecules/UrlPagination/UrlPagination';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { DocumentVerificationTable } from './components/DocumentVerificationTable/DocumentVerificationTable';
import { NoDocumentVerificationChecks } from './components/NoDocumentVerificationChecks/NoDocumentVerificationChecks';
import { CreateDocumentVerificationCheckDialog } from './components/CreateDocumentVerificationCheckDialog/CreateDocumentVerificationCheckDialog';
import { useDocumentVerificationLogic } from './hooks/useDocumentVerificationLogic/useDocumentVerificationLogic';
import { DateRange } from 'react-day-picker';
import { TDocumentVerificationCheck } from '@/domains/document-verification/fetchers';

export const DocumentVerification: FunctionComponent = () => {
  const {
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
  } = useDocumentVerificationLogic();

  // Adapter function to convert dates to DateRange format
  const adaptDatesToDateRange = (): DateRange | undefined => {
    if (!dates.from && !dates.to) return undefined;
    return {
      from: dates.from,
      to: dates.to,
    };
  };

  // Adapter function to handle DateRange changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    onDatesChange({
      from: range?.from,
      to: range?.to,
    });
  };

  // Ensure all documents have a valid status - this fixes the type issue
  const normalizedDocuments = useMemo(() => {
    if (!documentVerificationChecks) return [];

    return documentVerificationChecks.map(doc => ({
      ...doc,
      // Default to 'pending' if status is undefined
      status: doc.status || 'pending',
    })) as TDocumentVerificationCheck[];
  }, [documentVerificationChecks]);

  return (
    <DemoAccessWrapper
      firstName={firstName}
      fullName={fullName}
      avatarUrl={avatarUrl}
      onClick={() => toggleOpen(true)}
    >
      <div className="space-y-4 px-6 pb-6">
        <div className={`flex justify-between pb-2`}>
          <h1 className="text-2xl font-bold">Document Verification</h1>
          <div className={`flex space-x-3`}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className={`flex cursor-pointer items-center opacity-50`} asChild>
                  <div>
                    <Link
                      className={buttonVariants({
                        variant: 'outline',
                        className:
                          'flex items-center justify-start gap-2 font-semibold aria-disabled:pointer-events-none aria-disabled:opacity-50',
                      })}
                      onClick={(e: React.MouseEvent) => {
                        if (!createDocumentReportBatch?.enabled || isDemoAccount) {
                          e.preventDefault();
                        }
                      }}
                      to={`/${locale}/document-verification/upload-batch`}
                      aria-disabled={!createDocumentReportBatch?.enabled || isDemoAccount}
                    >
                      <Layers />
                      <span>Batch Actions</span>
                    </Link>
                  </div>
                </TooltipTrigger>
                {!createDocumentReportBatch?.enabled && !isDemoAccount && (
                  <TooltipContent side={'left'} align={'start'}>
                    This feature is currently disabled
                  </TooltipContent>
                )}
                {isDemoAccount && (
                  <TooltipContent side={'left'} align={'start'}>
                    This feature is not available for trial accounts.
                    <br />
                    Talk to us to get full access.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className={`flex items-center`}>
                  <CreateDocumentVerificationCheckDialog
                    open={open}
                    toggleOpen={toggleOpen}
                    disabled={!createDocumentReport.enabled}
                  >
                    <Button
                      variant="wp-primary"
                      className="flex items-center gap-2 font-semibold"
                      aria-disabled={!createDocumentReport.enabled}
                    >
                      <Plus />
                      <span>Create a Case</span>
                    </Button>
                  </CreateDocumentVerificationCheckDialog>
                </TooltipTrigger>
                {!createDocumentReport?.enabled && (
                  <TooltipContent side={'left'} align={'start'}>
                    This feature is currently disabled
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className={`flex items-center space-x-4`}>
          <Search value={search} onChange={onSearch} />
          <DateRangePicker
            toDate={new Date()}
            value={adaptDatesToDateRange()}
            onChange={handleDateRangeChange}
          />
          {isClearAllButtonVisible && (
            <Button
              variant={`ghost`}
              className={`h-8 select-none p-0 text-[#007AFF] hover:bg-transparent hover:text-[#005BB2]`}
              onClick={onClearAllFilters}
            >
              Clear All
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between">
          {!isLoadingDocumentVerificationChecks && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {totalItems} results
            </Badge>
          )}
        </div>
        <div className="space-y-6">
          {isLoadingDocumentVerificationChecks && (
            <div className={`flex h-full w-full items-center justify-center`}>
              <Loader2 className={`h-[60px] w-[60px] animate-spin`} />
            </div>
          )}
          {!isLoadingDocumentVerificationChecks && isNonEmptyArray(normalizedDocuments) && (
            <DocumentVerificationTable data={normalizedDocuments} isDemoAccount={isDemoAccount} />
          )}
          {!isLoadingDocumentVerificationChecks &&
            Array.isArray(normalizedDocuments) &&
            !normalizedDocuments.length && <NoDocumentVerificationChecks />}
          <div className={`flex items-center gap-x-2`}>
            <div className={`flex h-full w-[12ch] items-center text-sm`}>
              {!isLoadingDocumentVerificationChecks && `Page ${page} of ${totalPages || 1}`}
              {isLoadingDocumentVerificationChecks && <Skeleton className={`h-5 w-full`} />}
            </div>
            <UrlPagination
              page={page}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              onLastPage={onLastPage}
              onPaginate={onPaginate}
              isLastPage={isLastPage}
            />
          </div>
        </div>
      </div>
    </DemoAccessWrapper>
  );
};
