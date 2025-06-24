import { isNonEmptyArray } from '@ballerine/common';
import { Badge, Skeleton } from '@ballerine/ui';
import { Loader2, Plus } from 'lucide-react';
import { FunctionComponent } from 'react';

import { Button } from '@/common/components/atoms/Button/Button';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { Search } from '@/common/components/molecules/Search';
import { UrlPagination } from '@/common/components/molecules/UrlPagination/UrlPagination';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { AssessmentsTable } from './components/AssessmentsTable/AssessmentsTable';
import { NoAssessments } from './components/NoAssessments/NoAssessments';
import { useAssessmentsLogic } from './hooks/useAssessmentsLogic/useAssessmentsLogic';
import { CreateAssessmentDialog } from './components/CreateAssessmentDialog/CreateAssessmentDialog';

export const AssessmentsPage: FunctionComponent = () => {
  const {
    assessments,
    isLoadingAssessments,
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
    onClearAllFilters,
    isClearAllButtonVisible,
    firstName,
    fullName,
    avatarUrl,
    open,
    toggleOpen,
    pageTitle,
    assessmentType,
    createActionTitle,
  } = useAssessmentsLogic();

  return (
    <DemoAccessWrapper
      firstName={firstName}
      fullName={fullName}
      avatarUrl={avatarUrl}
      onClick={() => toggleOpen(true)}
    >
      <div className="space-y-4 px-6 pb-6">
        <div className={`flex justify-between pb-2`}>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <div className={`flex space-x-3`}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className={`flex items-center`}>
                  <CreateAssessmentDialog
                    open={open}
                    type={assessmentType}
                    toggleOpen={toggleOpen}
                    trigger={
                      <Button
                        variant="wp-primary"
                        className="flex items-center gap-2 font-semibold"
                      >
                        <Plus />
                        <span>{createActionTitle}</span>
                      </Button>
                    }
                  />
                </TooltipTrigger>
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
          {!isLoadingAssessments && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {totalItems} results
            </Badge>
          )}
        </div>
        <div className="space-y-6">
          {isLoadingAssessments && (
            <div className={`flex h-full w-full items-center justify-center`}>
              <Loader2 className={`animate-spin d-[60px]`} />
            </div>
          )}
          {!isLoadingAssessments && isNonEmptyArray(assessments) && (
            <AssessmentsTable data={assessments} type={assessmentType} />
          )}
          {!isLoadingAssessments && Array.isArray(assessments) && !assessments.length && (
            <NoAssessments />
          )}
          <div className={`flex items-center gap-x-2`}>
            <div className={`flex h-full w-[12ch] items-center text-sm`}>
              {!isLoadingAssessments && `Page ${page} of ${totalPages || 1}`}
              {isLoadingAssessments && <Skeleton className={`h-5 w-full`} />}
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
