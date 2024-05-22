import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import {
  CompanyOwnershipPage,
  CompanyOwnershipSchema,
  EmptyCompanyOwnershipPage,
  TCompanyOwnershipData,
} from '@/pages/Entity/pdfs/case-information/pages/CompanyOwnershipPage';

export class CompanyOwnershipPagePDF extends IPDFRenderer<TCompanyOwnershipData> {
  static PDF_NAME = 'companyOwnershipPage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    if (this.isEmpty(pdfData)) return <EmptyCompanyOwnershipPage data={pdfData} />;

    return <CompanyOwnershipPage data={pdfData} />;
  }

  async getData() {
    const pdfData: TCompanyOwnershipData = {
      companyName: this.workflow?.context?.entity?.data?.companyName || '',
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
      items: (this.workflow?.context?.pluginsOutput?.ubo?.data?.uboGraph || []).map((ubo: any) => ({
        companyName: ubo?.name,
        companyType: ubo?.type,
        ownershipPercentage: ubo?.shareHolders?.[0]?.sharePercentage,
        level: ubo?.level,
      })),
    };

    return pdfData;
  }

  isValid(data: TCompanyOwnershipData) {
    CompanyOwnershipSchema.parse(data);
  }

  private isEmpty(data: TCompanyOwnershipData) {
    return !data.items?.length;
  }
}
