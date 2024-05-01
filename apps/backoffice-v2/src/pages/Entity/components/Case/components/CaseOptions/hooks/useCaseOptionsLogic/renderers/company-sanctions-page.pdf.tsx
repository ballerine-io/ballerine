import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import {
  CompanySanctionsPage,
  CompanySanctionsSchema,
  EmptyCompanySanctionsPage,
  TCompanySanctionsData,
} from '@/pages/Entity/pdfs/case-information/pages/CompanySanctionsPage';
import get from 'lodash/get';
import map from 'lodash/map';

export class CompanySanctionsPagePDF extends IPDFRenderer<TCompanySanctionsData> {
  static PDF_NAME = 'companySanctionsPage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    if (this.isEmpty(pdfData)) return <EmptyCompanySanctionsPage data={pdfData} />;

    return <CompanySanctionsPage data={pdfData} />;
  }

  async getData() {
    const pdfData: TCompanySanctionsData = {
      companyName: get(this.workflow.context, 'entity.data.companyName', ''),
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
      sanctions: map(
        get(this.workflow.context, 'pluginsOutput.companySanctions.data', []),
        sanction => ({
          name: get(sanction, 'entity.name', ''),
          reviewDate: get(sanction, 'entity.lastReviewed', ''),
          labels: get(sanction, 'entity.categories', []),
          sources: map(get(sanction, 'entity.sources', []), source => get(source, 'url', '')),
          addresses: get(sanction, 'entity.places', []),
          matchReasons: get(sanction, 'matchedFields', []),
        }),
      ),
    };

    return pdfData;
  }

  isValid(data: TCompanySanctionsData) {
    CompanySanctionsSchema.parse(data);
  }

  private isEmpty(data: TCompanySanctionsData) {
    if (!data.sanctions?.length) {
      return true;
    }

    return false;
  }
}
