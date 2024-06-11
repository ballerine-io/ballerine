import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import { TitlePage } from '@/pages/Entity/pdfs/case-information/pages/TitlePage';
import {
  BaseCaseInformationPdfSchema,
  TBaseCaseInformationPdf,
} from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';

export class TitlePagePDF extends IPDFRenderer<TBaseCaseInformationPdf> {
  static PDF_NAME = 'titlePage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    return <TitlePage {...pdfData} />;
  }

  async getData() {
    const pdfData: TBaseCaseInformationPdf = {
      companyName: this.workflow.context?.entity?.data?.companyName || '',
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
    };

    return pdfData;
  }

  isValid(data: TBaseCaseInformationPdf) {
    BaseCaseInformationPdfSchema.parse(data);
  }
}
