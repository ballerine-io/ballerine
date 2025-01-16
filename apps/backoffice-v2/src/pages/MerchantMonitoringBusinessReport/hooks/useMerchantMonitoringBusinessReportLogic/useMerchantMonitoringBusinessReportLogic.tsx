import { ParsedBooleanSchema, useReportTabs } from '@ballerine/ui';
import { t } from 'i18next';
import { useCallback, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { safeUrl } from '@/common/utils/safe-url/safe-url';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';
import {
  MERCHANT_REPORT_STATUSES_MAP,
  MERCHANT_REPORT_TYPES_MAP,
} from '@/domains/business-reports/constants';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { useNotesByNoteable } from '@/domains/notes/hooks/queries/useNotesByNoteable/useNotesByNoteable';
import { useToggleMonitoringMutation } from '@/pages/MerchantMonitoringBusinessReport/hooks/useToggleMonitoringMutation/useToggleMonitoringMutation';
import { isObject } from '@ballerine/common';
import { zodResolver } from '@hookform/resolvers/zod';

const ZodDeboardingSchema = z
  .object({
    reason: z.string().optional(),
    userReason: z.string().optional(),
  })
  .refine(
    ({ reason, userReason }) => {
      if (reason === 'other') {
        return !!userReason && userReason.length >= 5;
      }

      return true;
    },
    ({ reason }) => {
      if (reason === 'other') {
        return {
          message: 'Please provide a reason of at least 5 characters',
          path: ['userReason'],
        };
      }

      return { message: 'Invalid Input' };
    },
  );

const statusToBadgeData = {
  [MERCHANT_REPORT_STATUSES_MAP.completed]: { variant: 'info', text: 'Manual Review' },
  [MERCHANT_REPORT_STATUSES_MAP['in-progress']]: { variant: 'violet', text: 'In-progress' },
  [MERCHANT_REPORT_STATUSES_MAP['quality-control']]: {
    variant: 'violet',
    text: 'Quality Control',
  },
  [MERCHANT_REPORT_STATUSES_MAP['failed']]: { variant: 'destructive', text: 'Failed' },
} as const;

const deboardingReasonOptions = [
  { value: 'fraud', label: 'Fraudulent Activity Detected' },
  { value: 'regulations', label: 'Non-Compliance with Regulations' },
  { value: 'disputes', label: 'Excessive Chargebacks or Disputes' },
  { value: 'expired', label: 'Business Relationship Ended' },
  { value: 'other', label: 'Other' },
] as const;

export const useMerchantMonitoringBusinessReportLogic = () => {
  const { businessReportId } = useParams();
  const { data: businessReport, isFetching: isFetchingBusinessReport } = useBusinessReportByIdQuery(
    { id: businessReportId ?? '' },
  );

  const { data: notes } = useNotesByNoteable({
    noteableId: businessReportId,
    noteableType: 'Report',
  });

  const [isDeboardModalOpen, setIsDeboardModalOpen] = useToggle(false);
  const [isDropdownOpen, setIsDropdownOpen] = useToggle(false);

  const formDefaultValues = {
    reason: undefined,
    userReason: '',
  } satisfies z.infer<typeof ZodDeboardingSchema>;

  const form = useForm({
    resolver: zodResolver(ZodDeboardingSchema),
    defaultValues: formDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof ZodDeboardingSchema>> = async (data, e) => {
    if (!businessReport?.merchantId) {
      throw new Error('Merchant ID is missing');
    }

    return turnOffMonitoringMutation.mutate({ merchantId: businessReport.merchantId, body: data });
  };

  const turnOnMonitoringMutation = useToggleMonitoringMutation({
    state: 'on',
    onSuccess: () => {
      toast.success(t(`toast:business_monitoring_on.success`));
    },
    onError: error => {
      toast.error(
        t(`toast:business_monitoring_on.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });

  const turnOffMonitoringMutation = useToggleMonitoringMutation({
    state: 'off',
    onSuccess: () => {
      setIsDeboardModalOpen(false);
      setIsDropdownOpen(false);
      form.reset();
      toast.success(t(`toast:business_monitoring_off.success`));
    },
    onError: error => {
      toast.error(
        t(`toast:business_monitoring_off.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });

  const { tabs } = useReportTabs({
    reportVersion: businessReport?.workflowVersion,
    isOnboarding: businessReport?.reportType === MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1,
    report: businessReport?.data ?? {},
    companyName: businessReport?.companyName,
    Link: RiskIndicatorLink,
  });

  const tabsValues = useMemo(() => tabs.map(tab => tab.value), [tabs]);

  const MerchantMonitoringBusinessReportSearchSchema = z.object({
    isNotesOpen: ParsedBooleanSchema.catch(false),
    activeTab: z
      .enum(
        // @ts-expect-error - zod doesn't like we are using `Array.prototype.map`
        tabsValues,
      )
      .catch(tabsValues[0]!),
  });

  const [{ activeTab, isNotesOpen }] = useZodSearchParams(
    MerchantMonitoringBusinessReportSearchSchema,
    { replace: true },
  );

  const navigate = useNavigate();

  const onNavigateBack = useCallback(() => {
    const previousPath = sessionStorage.getItem(
      'merchant-monitoring:business-report:previous-path',
    );

    if (!previousPath) {
      navigate('../');

      return;
    }

    navigate(previousPath);
    sessionStorage.removeItem('merchant-monitoring:business-report:previous-path');
  }, [navigate]);

  const websiteWithNoProtocol = safeUrl(businessReport?.website)?.hostname;

  return {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    statusToBadgeData,
    tabs,
    notes,
    activeTab,
    isNotesOpen,
    turnOngoingMonitoringOn: turnOnMonitoringMutation.mutate,
    isDeboardModalOpen,
    setIsDeboardModalOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    form,
    onSubmit,
    deboardingReasonOptions,
    isFetchingBusinessReport,
  };
};
