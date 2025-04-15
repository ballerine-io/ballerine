import { isNonEmptyArray } from '@ballerine/common';
import {
  Badge,
  ContentTooltip,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Skeleton,
} from '@ballerine/ui';
import { t } from 'i18next';
import { Layers, Loader2, Download, Plus, SlidersHorizontal } from 'lucide-react';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { Button, buttonVariants } from '@/common/components/atoms/Button/Button';
import { MultiSelect } from '@/common/components/atoms/MultiSelect/MultiSelect';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { Search } from '@/common/components/molecules/Search';
import { UrlPagination } from '@/common/components/molecules/UrlPagination/UrlPagination';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { MerchantMonitoringTable } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/MerchantMonitoringTable';
import { NoBusinessReports } from '@/pages/MerchantMonitoring/components/NoBusinessReports/NoBusinessReports';
import { useMerchantMonitoringLogic } from '@/pages/MerchantMonitoring/hooks/useMerchantMonitoringLogic/useMerchantMonitoringLogic';
import { CreateMerchantReportDialog } from './components/CreateMerchantReportDialog/CreateMerchantReportDialog';

export const MerchantMonitoring: FunctionComponent = () => {
  const {
    businessReports,
    isLoadingBusinessReports,
    isLoadingFindings,
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
    onExport,
    locale,
    createBusinessReport,
    createBusinessReportBatch,
    reportType,
    onReportTypeChange,
    onClearAllFilters,
    REPORT_TYPE_TO_DISPLAY_TEXT,
    IS_ALERT_TO_DISPLAY_TEXT,
    FINDINGS_FILTER,
    RISK_LEVEL_FILTER,
    STATUS_LEVEL_FILTER,
    handleFilterChange,
    handleFilterClear,
    riskLevels,
    statuses,
    findings,
    isAlert,
    multiselectProps,
    isClearAllButtonVisible,
    onIsAlertChange,
    firstName,
    fullName,
    avatarUrl,
    open,
    toggleOpen,
    isDemoAccount,
    isExportingReport,
  } = useMerchantMonitoringLogic();

  return (
    <DemoAccessWrapper
      firstName={firstName}
      fullName={fullName}
      avatarUrl={avatarUrl}
      onClick={() => toggleOpen(true)}
    >
      <div className="space-y-4 px-6 pb-6">
        <div className={`flex justify-between pb-2`}>
          <h1 className="text-2xl font-bold">Web Presence</h1>
          <div className={`flex space-x-3`}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className={`flex items-center`} asChild>
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
                    Talk to us to get full access.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className={`flex items-center`}>
                  <CreateMerchantReportDialog
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
                      <span>Create a report</span>
                    </Button>
                  </CreateMerchantReportDialog>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`h-8 space-x-2.5 p-2 font-normal`}>
                <SlidersHorizontal className="d-4" />
                <span>Type</span>
                {reportType !== 'All' && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <div className="hidden space-x-1 lg:flex">
                      <Badge
                        key={`${reportType}-badge`}
                        variant="secondary"
                        className="rounded-sm px-1 text-xs font-normal"
                      >
                        {reportType}
                      </Badge>
                    </div>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={`start`}>
              {Object.entries(REPORT_TYPE_TO_DISPLAY_TEXT).map(([type, displayText]) => (
                <DropdownMenuCheckboxItem
                  key={displayText}
                  checked={reportType === displayText}
                  onCheckedChange={() =>
                    onReportTypeChange(type as keyof typeof REPORT_TYPE_TO_DISPLAY_TEXT)
                  }
                >
                  {displayText}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <MultiSelect
            props={multiselectProps}
            key={STATUS_LEVEL_FILTER.title}
            selectedValues={statuses ?? []}
            title={STATUS_LEVEL_FILTER.title}
            options={STATUS_LEVEL_FILTER.options}
            onSelect={handleFilterChange(STATUS_LEVEL_FILTER.accessor)}
            onClearSelect={handleFilterClear(STATUS_LEVEL_FILTER.accessor)}
          />
          <MultiSelect
            props={multiselectProps}
            key={RISK_LEVEL_FILTER.title}
            title={RISK_LEVEL_FILTER.title}
            selectedValues={riskLevels ?? []}
            options={RISK_LEVEL_FILTER.options}
            onSelect={handleFilterChange(RISK_LEVEL_FILTER.accessor)}
            onClearSelect={handleFilterClear(RISK_LEVEL_FILTER.accessor)}
          />
          <MultiSelect
            props={{ ...multiselectProps, content: { className: 'w-[400px]' } }}
            key={FINDINGS_FILTER.title}
            title={FINDINGS_FILTER.title}
            isLoading={isLoadingFindings}
            selectedValues={findings ?? []}
            options={FINDINGS_FILTER.options}
            onSelect={handleFilterChange(FINDINGS_FILTER.accessor)}
            onClearSelect={handleFilterClear(FINDINGS_FILTER.accessor)}
          />
          {!isDemoAccount && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`h-8 space-x-2.5 p-2 font-normal`}>
                  <SlidersHorizontal className="d-4" />
                  <span>Monitoring Alerts</span>
                  {isAlert !== 'All' && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <div className="hidden space-x-1 lg:flex">
                        <Badge
                          key={`${isAlert}-badge`}
                          variant="secondary"
                          className="rounded-sm px-1 text-xs font-normal"
                        >
                          {isAlert}
                        </Badge>
                      </div>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={`start`}>
                {Object.entries(IS_ALERT_TO_DISPLAY_TEXT).map(([value, label]) => (
                  <DropdownMenuCheckboxItem
                    key={label}
                    checked={isAlert === label}
                    onCheckedChange={() =>
                      onIsAlertChange(value as keyof typeof IS_ALERT_TO_DISPLAY_TEXT)
                    }
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
          <ContentTooltip
            description="Export reports to a CSV file (filters applied)"
            props={{ tooltipContent: { align: 'center' }, tooltipTrigger: { className: 'pr-0' } }}
          >
            <Button
              variant="outline"
              className={`h-8 space-x-2.5 p-2 font-normal`}
              onClick={onExport}
              disabled={isExportingReport}
            >
              {isExportingReport ? (
                <Loader2 className="animate-spin d-4" />
              ) : (
                <Download className="d-4" />
              )}
              <span>Export</span>
            </Button>
          </ContentTooltip>
        </div>
        <div className="space-y-6">
          {isLoadingBusinessReports && (
            <div className={`flex h-full w-full items-center justify-center`}>
              <Loader2 className={`animate-spin d-[60px]`} />
            </div>
          )}
          {!isLoadingBusinessReports && isNonEmptyArray(businessReports) && (
            <MerchantMonitoringTable data={businessReports} isDemoAccount={isDemoAccount} />
          )}
          {!isLoadingBusinessReports &&
            Array.isArray(businessReports) &&
            !businessReports.length && <NoBusinessReports />}
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
