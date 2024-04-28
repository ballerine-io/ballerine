import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { CompanyOwnershipPage } from '@/pages/Entity/pdfs/case-information/pages/CompanyOwnershipPage';
import { CompanySanctionsPage } from '@/pages/Entity/pdfs/case-information/pages/CompanySanctionsPage';
import { IdentityVerificationsPage } from '@/pages/Entity/pdfs/case-information/pages/IdentityVerificationsPage';
import { IndividualSanctionsPage } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage';
import { RegistryInformationPage } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage';
import { TitlePage } from '@/pages/Entity/pdfs/case-information/pages/TitlePage';
import { registerFont } from '@ballerine/react-pdf-toolkit';
import { Document, Font, pdf } from '@react-pdf/renderer';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

registerFont(Font);

const downloadFile = (file: File) => {
  const link = document.createElement('a');

  link.href = URL.createObjectURL(file);
  link.download = file.name;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
};

export const useCaseOptionsLogic = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { data: workflow } = useCurrentCaseQuery();

  const genereateAndDownloadPDFCertificate = useCallback(async () => {
    try {
      setIsGeneratingPDF(true);

      const PDFBlob = await pdf(
        <Document>
          <TitlePage />
          <RegistryInformationPage />
          <CompanyOwnershipPage />
          <CompanySanctionsPage />
          <IdentityVerificationsPage />
          <IndividualSanctionsPage />
        </Document>,
      ).toBlob();

      const pdfFile = new File([PDFBlob], 'certificate.pdf');

      downloadFile(pdfFile);
    } catch (error) {
      console.error(`Failed to download PDF certificate: ${error}`);
      toast.error('Failed to download PDF certificate.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [workflow]);

  return {
    isGeneratingPDF,
    genereateAndDownloadPDFCertificate,
  };
};
