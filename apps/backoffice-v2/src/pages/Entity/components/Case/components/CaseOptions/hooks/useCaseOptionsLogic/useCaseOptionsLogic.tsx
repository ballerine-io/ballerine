import { TCustomer } from '@/domains/customer/fetchers';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/userCustomerQuery';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CompanyOwnershipPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/company-ownership-page.pdf';
import { CompanySanctionsPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/company-sanctions-page.pdf';
import { IdentityVerificationsPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/identity-verifications-page.pdf';
import { IndividualSantcionsPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/individual-sanctions-page.pdf';
import { RegistryPagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/registry-page.pdf';
import { TitlePagePDF } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/title-page.pdf';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { Document, pdf } from '@react-pdf/renderer';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const openFile = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10_000);
};

export const useCaseOptionsLogic = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { data: workflow } = useCurrentCaseQuery();
  const { data: customer } = useCustomerQuery();

  const genereateAndDownloadPDFCertificate = useCallback(async () => {
    try {
      setIsGeneratingPDF(true);

      const pdfs = [
        TitlePagePDF,
        RegistryPagePDF,
        CompanyOwnershipPagePDF,
        CompanySanctionsPagePDF,
        IdentityVerificationsPagePDF,
        IndividualSantcionsPagePDF,
      ];
      const renderers = pdfs.map(PDF => new PDF(workflow as TWorkflowById, customer as TCustomer));
      const pages = await Promise.all(renderers.map(renderer => renderer.render()));

      const PDFBlob = await pdf(<Document>{pages}</Document>).toBlob();

      openFile(PDFBlob);
    } catch (error) {
      console.error(`Failed to download PDF certificate: ${error}`);
      toast.error('Failed to download PDF certificate.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [workflow, customer]);

  return {
    isGeneratingPDF,
    genereateAndDownloadPDFCertificate,
  };
};
