import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TCustomer } from '@/domains/customer/fetchers';
import { useMutation } from '@tanstack/react-query';
import { TitlePagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/title-page.pdf';
import { RegistryPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/registry-page.pdf';
import { CompanyOwnershipPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/company-ownership-page.pdf';
import { CompanySanctionsPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/company-sanctions-page.pdf';
import { IdentityVerificationsPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/identity-verifications-page.pdf';
import { IndividualSantcionsPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/individual-sanctions-page.pdf';
import { Document, pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { t } from 'i18next';

const openBlobInNewTab = (blob: Blob) => {
  const url = URL.createObjectURL(blob);

  window.open(url, '_blank');

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10_000);
};

export const useGeneratePDFMutation = ({
  workflow,
  customer,
}: {
  workflow: TWorkflowById;
  customer: TCustomer;
}) => {
  return useMutation({
    mutationFn: async () => {
      const pdfs = [
        TitlePagePDF,
        RegistryPagePDF,
        CompanyOwnershipPagePDF,
        CompanySanctionsPagePDF,
        IdentityVerificationsPagePDF,
        IndividualSantcionsPagePDF,
      ];
      const renderers = pdfs.map(PDF => new PDF(workflow, customer));
      const pages = await Promise.all(renderers.map(renderer => renderer.render()));

      const pdfBlob = await pdf(<Document>{pages}</Document>).toBlob();

      openBlobInNewTab(pdfBlob);
    },
    onError: error => {
      console.error(`Failed to open PDF certificate: ${JSON.stringify(error)}`);
      toast.error(t('toast:pdf_certificate.error'));
    },
  });
};
