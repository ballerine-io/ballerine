import { z } from 'zod';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import { t } from 'i18next';
import { toast } from 'sonner';
import { capitalize } from 'lodash-es';
import html2canvas from 'html2canvas-pro';
import { isObject } from '@ballerine/common';
import { ParsedBooleanSchema } from '@ballerine/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { safeUrl } from '@/common/utils/safe-url/safe-url';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useNotesByNoteable } from '@/domains/notes/hooks/queries/useNotesByNoteable/useNotesByNoteable';
import { useCreateNoteMutation } from '@/domains/notes/hooks/mutations/useCreateNoteMutation/useCreateNoteMutation';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { useToggleMonitoringMutation } from '@/pages/MerchantMonitoringBusinessReport/hooks/useToggleMonitoringMutation/useToggleMonitoringMutation';

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

const deboardingReasonOptions = [
  'Fraudulent Activity Detected',
  'Non-Compliance with Regulations',
  'Excessive Chargebacks or Disputes',
  'Business Relationship Ended',
  'Other',
] as const;

export const useMerchantMonitoringBusinessReportLogic = () => {
  const { businessReportId } = useParams();
  const { data: customer } = useCustomerQuery();
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

  const onSubmit: SubmitHandler<z.infer<typeof ZodDeboardingSchema>> = async () => {
    if (!businessReport?.business.id) {
      throw new Error('Business ID is missing');
    }

    return turnOffMonitoringMutation.mutate(businessReport.business.id);
  };

  const { mutateAsync: mutateCreateNote } = useCreateNoteMutation({ disableToast: true });
  const turnOnMonitoringMutation = useToggleMonitoringMutation({
    state: 'on',
    onSuccess: () => {
      void mutateCreateNote({
        content: 'Monitoring turned on',
        entityId: businessReport?.business.id ?? '',
        entityType: 'Business',
        noteableId: businessReport?.id ?? '',
        noteableType: 'Report',
        parentNoteId: null,
      });
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
      const { reason, userReason } = form.getValues();
      const content = [
        'Monitoring turned off',
        reason ? `with reason: ${capitalize(reason)}` : null,
        userReason ? `(${userReason})` : '',
      ]
        .filter(Boolean)
        .join(' ');
      void mutateCreateNote({
        content,
        entityId: businessReport?.business.id ?? '',
        entityType: 'Business',
        noteableId: businessReport?.id ?? '',
        noteableType: 'Report',
        parentNoteId: null,
      });
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

  const MerchantMonitoringBusinessReportSearchSchema = z.object({
    isNotesOpen: ParsedBooleanSchema.catch(false),
  });

  const [{ isNotesOpen }, setSearchParams] = useZodSearchParams(
    MerchantMonitoringBusinessReportSearchSchema,
    { replace: true },
  );

  const setIsNotesOpen = useCallback(
    (value: boolean) => {
      setSearchParams({ isNotesOpen: value });
    },
    [setSearchParams],
  );

  const navigate = useNavigate();

  const onNavigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const websiteWithNoProtocol = safeUrl(businessReport?.website)?.hostname;
  const locale = useLocale();

  // Default SPA behavior preserves scroll position on navigation (react-router-dom)
  // We want the business report page to always scroll to the top on navigation to avoid confusing the user
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [isGeneratingPDF, toggleIsGeneratingPDF] = useToggle(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const reportPDFContainerRef = useRef<HTMLDivElement>(null);

  const generatePDF = useCallback(async () => {
    if (!reportRef.current || !reportPDFContainerRef.current) {
      return;
    }

    toggleIsGeneratingPDF();

    try {
      const element = reportRef.current;
      const container = reportPDFContainerRef.current;

      const contentContainer = container.querySelector('.pdf-content');

      if (!contentContainer) {
        throw new Error('PDF content container not found');
      }

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = `${element.scrollWidth}px`;

      contentContainer.innerHTML = '';
      contentContainer.appendChild(clone);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
      });

      contentContainer.innerHTML = '';

      const imageData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality for smaller file size
      const aspectRatio = canvas.height / canvas.width;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = pdfWidth * aspectRatio;

      const pdf = new jsPDF({
        unit: 'mm',
        orientation: 'portrait',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imageData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${websiteWithNoProtocol || 'business'}-report-${dayjs().format('YYYY-MM-DD')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }

    toggleIsGeneratingPDF();
  }, [toggleIsGeneratingPDF, websiteWithNoProtocol]);

  return {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    notes,
    isNotesOpen,
    setIsNotesOpen,
    turnOngoingMonitoringOn: turnOnMonitoringMutation.mutate,
    isDeboardModalOpen,
    setIsDeboardModalOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    form,
    onSubmit,
    deboardingReasonOptions,
    isFetchingBusinessReport,
    locale,
    isDemoAccount: customer?.config?.isDemoAccount ?? false,
    reportRef,
    reportPDFContainerRef,
    generatePDF,
    isGeneratingPDF,
  };
};
