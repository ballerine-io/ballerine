import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import { RegistryInformationPage } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage';
import { TRegistryInformationData } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/registry-information.schema';
import {
  TTitlePageData,
  TitlePageSchema,
} from '@/pages/Entity/pdfs/case-information/pages/TitlePage';
import get from 'lodash/get';

export class RegistryPagePDF extends IPDFRenderer<TTitlePageData> {
  static PDF_NAME = 'titlePage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    return <RegistryInformationPage data={pdfData} />;
  }

  async getData() {
    const pdfData: TRegistryInformationData = {
      companyName: get(this.workflow.context, 'entity.data.companyName', ''),
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
      registrationNumber: get(this.workflow.context, 'entity.data.registrationNumber', ''),
      incorporationDate: get(
        this.workflow.context,
        'entity.data.additionalInfo.dateOfEstablishment',
        null,
      ),
      companyType: get(this.workflow.context, 'entity.data.businessType', ''),
      // companyStatus is missing in context
      companyStatus: get(this.workflow.context, 'entity.data.status', ''),

      registrationAddress: [
        get(this.workflow.context, 'entity.data.headquarters.street', ''),
        get(this.workflow.context, 'entity.data.headquarters.streetNumber', ''),
        get(this.workflow.context, 'entity.data.headquarters.city', ''),
        get(this.workflow.context, 'entity.data.headquarters.country', ''),
        get(this.workflow.context, 'entity.data.headquarters.postalCode', ''),
      ]
        .filter(Boolean)
        .join(', '),
      registryPage: get(this.workflow.context, 'entity.data.registryPage', ''),
      lastUpdate: new Date(),
      registeredAt: get(this.workflow.context, 'entity.data.registeredAt', ''),
    };

    return pdfData;
  }

  isValid(data: TTitlePageData) {
    TitlePageSchema.parse(data);
  }
}
