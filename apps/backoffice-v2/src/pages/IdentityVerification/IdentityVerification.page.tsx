import { isNonEmptyArray } from '@ballerine/common';
import { Badge, Skeleton } from '@ballerine/ui';
import { t } from 'i18next';
import { Layers, Loader2, Plus } from 'lucide-react';
import { FunctionComponent } from 'react';
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
import { IdentityVerificationTable } from './components/IdentityVerificationTable/IdentityVerificationTable';
import { NoIdentityVerificationChecks } from './components/NoIdentityVerificationChecks/NoIdentityVerificationChecks';
import { CreateIdentityVerificationCheckDialog } from './components/CreateMerchantReportDialog/CreateIdentityVerificationCheckDialog';
import { useIdentityVerificationLogic } from './hooks/useIdentityVerificationLogic/useIdentityVerificationLogic';

export const IdentityVerification: FunctionComponent = () => {
  const {
    identityVerificationChecks,
    isLoadingIdentityVerificationChecks,
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
    createBusinessReport,
    createBusinessReportBatch,
    onClearAllFilters,
    IS_ALERT_TO_DISPLAY_TEXT,
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
  } = useIdentityVerificationLogic();

  return (
    <DemoAccessWrapper
      firstName={firstName}
      fullName={fullName}
      avatarUrl={avatarUrl}
      onClick={() => toggleOpen(true)}
    >
      <div className="space-y-4 px-6 pb-6">
        <div className={`flex justify-between pb-2`}>
          <h1 className="text-2xl font-bold">Identity Verification</h1>
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
                      onClick={e => {
                        if (!createBusinessReportBatch?.enabled || isDemoAccount) {
                          e.preventDefault();
                        }
                      }}
                      to={`/${locale}/merchant-monitoring/upload-multiple-merchants`}
                      aria-disabled={!createBusinessReportBatch?.enabled || isDemoAccount}
                    >
                      <Layers />
                      <span>Batch Actions</span>
                    </Link>
                  </div>
                </TooltipTrigger>
                {!createBusinessReportBatch?.enabled && !isDemoAccount && (
                  <TooltipContent side={'left'} align={'start'}>
                    {t('business_report_creation.is_disabled')}
                  </TooltipContent>
                )}
                {isDemoAccount && (
                  <TooltipContent side={'left'} align={'start'}>
                    This feature is not available for trial accounts.
                    <br />
                    Contact support@mikashboks.com to get full access.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className={`flex items-center`}>
                  <CreateIdentityVerificationCheckDialog
                    open={open}
                    toggleOpen={toggleOpen}
                    disabled={!createBusinessReport.enabled}
                  >
                    <Button
                      variant="wp-primary"
                      className="flex items-center gap-2 font-semibold"
                      aria-disabled={!createBusinessReport.enabled}
                    >
                      <Plus />
                      <span>Create a Case</span>
                    </Button>
                  </CreateIdentityVerificationCheckDialog>
                </TooltipTrigger>
                {!createBusinessReport?.enabled && (
                  <TooltipContent side={'left'} align={'start'}>
                    {t('business_report_creation.is_disabled')}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className={`flex items-center space-x-4`}>
          <Search value={search} onChange={onSearch} />
          <DateRangePicker toDate={new Date()} value={dates} onChange={onDatesChange} />
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
          {!isLoadingIdentityVerificationChecks && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {totalItems} results
            </Badge>
          )}
        </div>
        <div className="space-y-6">
          {isLoadingIdentityVerificationChecks && (
            <div className={`flex size-full items-center justify-center`}>
              <Loader2 className={`animate-spin d-[60px]`} />
            </div>
          )}
          {!isLoadingIdentityVerificationChecks && isNonEmptyArray(identityVerificationChecks) && (
            <IdentityVerificationTable
              data={identityVerificationChecks}
              isDemoAccount={isDemoAccount}
            />
          )}
          {!isLoadingIdentityVerificationChecks &&
            Array.isArray(identityVerificationChecks) &&
            !identityVerificationChecks.length && <NoIdentityVerificationChecks />}
          <div className={`flex items-center gap-x-2`}>
            <div className={`flex h-full w-[12ch] items-center text-sm`}>
              {!isLoadingIdentityVerificationChecks && `Page ${page} of ${totalPages || 1}`}
              {isLoadingIdentityVerificationChecks && <Skeleton className={`h-5 w-full`} />}
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
