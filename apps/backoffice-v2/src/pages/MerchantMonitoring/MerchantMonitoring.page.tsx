import React, { FunctionComponent } from 'react';
import { isNonEmptyArray } from '@ballerine/common';
import { UrlPagination } from '@/common/components/molecules/UrlPagination/UrlPagination';
import { useMerchantMonitoringLogic } from '@/pages/MerchantMonitoring/hooks/useMerchantMonitoringLogic/useMerchantMonitoringLogic';
import { NoBusinessReports } from '@/pages/MerchantMonitoring/components/NoBusinessReports/NoBusinessReports';
import { MerchantMonitoringTable } from '@/pages/MerchantMonitoring/components/MerchantMonitoringTable/MerchantMonitoringTable';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import { Plus, Table2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Search } from '@/common/components/molecules/Search';
import { Skeleton } from '@ballerine/ui';

export const MerchantMonitoring: FunctionComponent = () => {
  const {
    businessReports,
    isLoadingBusinessReports,
    search,
    onSearch,
    totalPages,
    page,
    onPrevPage,
    onNextPage,
    onLastPage,
    onPaginate,
    isLastPage,
    locale,
    createBusinessReport,
    createBusinessReportBatch,
  } = useMerchantMonitoringLogic();

  return (
    <div className="flex h-full flex-col space-y-4 px-6 pb-6 pt-10">
      <div className={`flex justify-between`}>
        <h1 className="pb-5 text-2xl font-bold">Merchant Monitoring</h1>
        {createBusinessReport?.enabled && (
          <div className={`flex space-x-3`}>
            {createBusinessReportBatch?.enabled && (
              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'flex items-center justify-start gap-2 font-semibold',
                })}
                to={`/${locale}/merchant-monitoring/upload-multiple-merchants`}
              >
                <Table2 />
                <span>Upload Multiple Merchants</span>
              </Link>
            )}
            <Link
              className={buttonVariants({
                variant: 'outline',
                className: 'flex items-center justify-start gap-2 font-semibold',
              })}
              to={`/${locale}/merchant-monitoring/create-check`}
            >
              <Plus />
              <span>Create Merchant Check</span>
            </Link>
          </div>
        )}
      </div>
      {!!businessReports?.length && (
        <div className={`flex`}>
          <Search value={search} onChange={onSearch} />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        {isNonEmptyArray(businessReports) && <MerchantMonitoringTable data={businessReports} />}
        {Array.isArray(businessReports) && !businessReports.length && !isLoadingBusinessReports && (
          <NoBusinessReports />
        )}
        <div className={`mt-auto flex items-center gap-x-2`}>
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
  );
};
