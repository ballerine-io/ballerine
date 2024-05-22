import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import {
  EmptyRegistryInformationPage,
  RegistryInformationPage,
} from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage';
import { TRegistryInformationData } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/registry-information.schema';
import { TitlePageSchema } from '@/pages/Entity/pdfs/case-information/pages/TitlePage';
import get from 'lodash/get';

export class RegistryPagePDF extends IPDFRenderer<TRegistryInformationData> {
  static PDF_NAME = 'titlePage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    if (this.isEmpty(pdfData)) return <EmptyRegistryInformationPage data={pdfData} />;

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

  isValid(data: TRegistryInformationData) {
    TitlePageSchema.parse(data);
  }

  private isEmpty(data: TRegistryInformationData) {
    const values = [
      data.registrationNumber,
      data.incorporationDate,
      data.companyType,
      data.companyStatus,
      data.registrationAddress,
      data.registryPage,
      data.lastUpdate,
      data.registeredAt,
    ];

    return values.every(value => {
      if (Array.isArray(value) && !value.length) return true;

      return !value;
    });
  }
}
