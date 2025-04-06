import { z } from 'zod';
import dayjs from 'dayjs';
import React, { forwardRef } from 'react';
import { ReportSchema } from '@ballerine/common';
import { TextWithNAFallback } from '@ballerine/ui';

import { ctw } from '@/common/utils/ctw/ctw';
import { BallerineLogo } from '@/common/components/atoms/icons';
import { MerchantMonitoringReportStatus } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringReportStatus';

interface ReportPDFContainerProps {
  websiteWithNoProtocol?: string;
  businessReport: z.infer<typeof ReportSchema>;
}

export const ReportPDFContainer = forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & ReportPDFContainerProps
>(({ businessReport, websiteWithNoProtocol, ...props }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '-10000px',
        left: '-10000px',
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#EFF4FD',
      }}
    >
      <div className="flex justify-between p-5">
        <div className="flex flex-col space-y-2">
          <BallerineLogo />

          <div className="flex items-center space-x-5">
            <div className="flex flex-col space-y-1">
              <span className="text-[8px] font-bold">Report ID</span>
              <span className="text-[8px]">{businessReport?.id}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[8px] font-bold">Merchant ID</span>
              <span className="text-[8px]">{businessReport?.business?.id ?? 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-sm font-bold">Report Export Date</span>
          <span className="text-xs">{dayjs().format('MMMM Do, YYYY HH:mm')}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-md bg-white p-5">
        <TextWithNAFallback as={'h2'} className="pb-4 text-2xl font-bold">
          {websiteWithNoProtocol}
        </TextWithNAFallback>

        <div className={`flex items-center space-x-8`}>
          <div className={`flex items-center`}>
            <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
            <MerchantMonitoringReportStatus
              reportId={businessReport?.id}
              status={businessReport?.status}
              businessId={businessReport?.business.id}
            />
          </div>
          <div className={`text-sm`}>
            <span className={`me-2 leading-6 text-slate-400`}>Created at</span>
            {businessReport?.displayDate &&
              dayjs(new Date(businessReport?.displayDate)).format('MMM Do, YYYY HH:mm')}
          </div>
          <div className={`flex items-center space-x-2 text-sm`}>
            <span className={`text-slate-400`}>Monitoring Status</span>
            <span
              className={ctw('select-none rounded-full d-3', {
                'bg-success': businessReport?.monitoringStatus,
                'bg-slate-400': !businessReport?.monitoringStatus,
              })}
            >
              &nbsp;
            </span>
          </div>
        </div>

        <div className="pdf-content">{props.children}</div>
      </div>

      <div className="flex flex-col gap-4 opacity-50">
        <div className="flex justify-between p-5 text-sm font-normal">
          <BallerineLogo />

          <div className="flex flex-col space-y-2">
            <span>Report powered by Ballerine.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex flex-col space-y-2">
            <span>For support and inquiries:</span>
            <span>support@ballerine.com</span>
          </div>

          <span>www.ballerine.com</span>
        </div>
        <div className="flex flex-col text-[8px]">
          <div className="font-bold">Disclaimer:</div>
          <div>
            This report (<span className="font-bold">&quot;Report&quot;</span>) is provided by
            Ballerine, Inc., its affiliates, and third-party licensors (collectively,
            <span className="font-bold">&quot;Ballerine&quot;</span> or{' '}
            <span className="font-bold">&quot;We&quot;</span>) solely to the client to whom it is
            addressed (<span className="font-bold">&quot;You&quot;</span>) for internal business
            purposes, in accordance with Your Master Services Agreement (
            <span className="font-bold">&quot;MSA&quot;</span>) with Ballerine. The Report is for
            general informational purposes only and is provided{' '}
            <span className="font-bold">&quot;AS IS&quot;</span>, without warranties of any kind,
            express or implied, including but not limited to accuracy, completeness, reliability,
            suitability, or availability for any purpose. Whilst We endeavor to keep the information
            up to date and correct, Ballerine makes no representations or warranties regarding the
            completeness, accuracy, reliability, or availability of the Report or any related
            information and will not be liable for any false, inaccurate, inappropriate, or
            incomplete information presented. You are solely responsible for ensuring compliance
            with all applicable laws, including privacy regulations (e.g.,{' '}
            <span className="font-bold">GDPR, CCPA</span>), and may not disclose, distribute, or
            share this Report or its contents with any third party without Ballerine’s prior written
            consent. To the maximum extent permitted by law, Ballerine disclaims all liability for
            any direct, indirect, incidental, special, punitive, or consequential damages arising
            from the use of this Report, and You assume full responsibility for any misuse,
            regulatory breaches, or violations of the MSA.
          </div>
        </div>
      </div>
    </div>
  );
});

ReportPDFContainer.displayName = 'ReportPDFContainer';
