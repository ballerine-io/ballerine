import { isNonEmptyArray } from '@ballerine/common';
import { Badge, Skeleton } from '@ballerine/ui';
import { t } from 'i18next';
import { Loader2, Plus } from 'lucide-react';
import { FunctionComponent } from 'react';

import { Button } from '@/common/components/atoms/Button/Button';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { Search } from '@/common/components/molecules/Search';
import { UrlPagination } from '@/common/components/molecules/UrlPagination/UrlPagination';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { KybAndOwnershipAssessmentsTable } from './components/KybAndOwnershipAssessmentsTable/KybAndOwnershipAssessmentsTable';
import { NoKybAndOwnershipAssessments } from './components/NoKybAndOwnershipAssessments/NoKybAndOwnershipAssessments';
import { useKybAndOwnershipLogic } from './hooks/useKybAndOwnershipLogic/useKybAndOwnershipLogic';
import { CreateKybAndOwnershipAssessmentDialog } from './components/CreateKybAndOwnershipAssessmentDialog/CreateKybAndOwnershipAssessmentDialog';

export const KybAndOwnership: FunctionComponent = () => {
  const {
    businessReports,
    isLoadingBusinessReports,
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
    createBusinessReport,
    onClearAllFilters,
    isClearAllButtonVisible,
    firstName,
    fullName,
    avatarUrl,
    open,
    toggleOpen,
  } = useKybAndOwnershipLogic();

  return (
    <DemoAccessWrapper
      firstName={firstName}
      fullName={fullName}
      avatarUrl={avatarUrl}
      onClick={() => toggleOpen(true)}
    >
      <div className="space-y-4 px-6 pb-6">
        <div className={`flex justify-between pb-2`}>
          <h1 className="text-2xl font-bold">KYB & Ownership</h1>
          <div className={`flex space-x-3`}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className={`flex items-center`}>
                  <CreateKybAndOwnershipAssessmentDialog
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
                  </CreateKybAndOwnershipAssessmentDialog>
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
          {!isLoadingBusinessReports && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {totalItems} results
            </Badge>
          )}
        </div>
        <div className="space-y-6">
          {isLoadingBusinessReports && (
            <div className={`flex h-full w-full items-center justify-center`}>
              <Loader2 className={`animate-spin d-[60px]`} />
            </div>
          )}
          {!isLoadingBusinessReports && isNonEmptyArray(businessReports) && (
            <KybAndOwnershipAssessmentsTable data={businessReports} />
          )}
          {!isLoadingBusinessReports &&
            Array.isArray(businessReports) &&
            !businessReports.length && <NoKybAndOwnershipAssessments />}
          <div className={`flex items-center gap-x-2`}>
            <div className={`flex h-full w-[12ch] items-center text-sm`}>
              {!isLoadingBusinessReports && `Page ${page} of ${totalPages || 1}`}
              {isLoadingBusinessReports && <Skeleton className={`h-5 w-full`} />}
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
