import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import {
  CompanySanctionsPage,
  CompanySanctionsSchema,
  EmptyCompanySanctionsPage,
  TCompanySanctionsData,
} from '@/pages/Entity/pdfs/case-information/pages/CompanySanctionsPage';

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
      companyName: this.workflow?.context?.entity?.data?.companyName || '',
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
      sanctions: (this.workflow?.context?.pluginsOutput?.companySanctions?.data || []).map(
        (sanction: any) => ({
          name: sanction.entity.name,
          reviewDate: sanction.entity.lastReviewed,
          labels: sanction.entity.categories,
          sources: sanction.entity.sources.map((source: { url: string }) => source.url),
          addresses: sanction.entity.places,
          matchReasons: sanction.matchedFields,
        }),
      ),
    };

    return pdfData;
  }

  isValid(data: TCompanySanctionsData) {
    CompanySanctionsSchema.parse(data);
  }

  private isEmpty(data: TCompanySanctionsData) {
    return !data.sanctions?.length;
  }
}
