import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import {
  TTitlePageData,
  TitlePage,
  TitlePageSchema,
} from '@/pages/Entity/pdfs/case-information/pages/TitlePage';

export class TitlePagePDF extends IPDFRenderer<TTitlePageData> {
  static PDF_NAME = 'titlePage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    return <TitlePage data={pdfData} />;
  }

  async getData() {
    const pdfData: TTitlePageData = {
      companyName: this.workflow.context?.entity?.data?.companyName || '',
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
    };

    return pdfData;
  }

  isValid(data: TTitlePageData) {
    TitlePageSchema.parse(data);
  }
}
