import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import { TTitlePageData, TitlePage } from '@/pages/Entity/pdfs/case-information/pages/TitlePage';
import get from 'lodash/get';

export class RegistryPagePDF extends IPDFRenderer<TTitlePageData> {
  static PDF_NAME = 'titlePage';

  render(): JSX.Element {
    return <TitlePage data={this.getData()} />;
  }

  getData() {
    const pdfData: TTitlePageData = {
      companyName: get(this.workflow.context, 'entity.data.companyName', ''),
      creationDate: new Date(),
      logoUrl: '',
    };

    return pdfData;
  }

  isValid(): boolean {
    return true;
  }
}
