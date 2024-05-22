import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import {
  EmptyIdentityVerificationsPage,
  IdentityVerificationsPage,
  TIdentityVerificationsData,
} from '@/pages/Entity/pdfs/case-information/pages/IdentityVerificationsPage';

export class IdentityVerificationsPagePDF extends IPDFRenderer<TIdentityVerificationsData> {
  static PDF_NAME = 'identityVerificationsPage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    if (this.isEmpty(pdfData)) return <EmptyIdentityVerificationsPage data={pdfData} />;

    return <IdentityVerificationsPage data={pdfData} />;
  }

  async getData() {
    const childWorkflowSessions = Object.values(this.workflow?.context.childWorkflows || {});

    const pdfData: TIdentityVerificationsData = {
      companyName: this.workflow?.context?.entity?.data?.companyName || '',
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
      items: childWorkflowSessions
        .map(childWorkflowSession => {
          return Object.values(childWorkflowSession || {}).map(
            (session: any): TIdentityVerificationsData['items'][number] => ({
              firstName: session.result?.childEntity?.firstName || '',
              lastName: session.result?.childEntity?.lastName || '',
              dateOfBirth: session.result?.entity?.data?.dateOfBirth || null,
              status:
                session.result?.vendorResult?.decision?.status || ('' as 'approved' | 'rejected'),
              checkDate: session.result?.vendorResult?.aml?.createdAt || null,
              id: session.result?.vendorResult?.metadata?.id || '',
              gender: session.result?.vendorResult?.entity?.data?.additionalInfo?.gender || '',
              nationality:
                session.result?.vendorResult?.entity?.data?.additionalInfo?.nationality || '',
              reason: session.result.vendorResult.decision.reason || '',
            }),
          );
        })
        .flat(),
    };

    return pdfData;
  }

  isValid(data: TIdentityVerificationsData) {}

  private isEmpty(data: TIdentityVerificationsData) {
    return !data.items?.length;
  }
}
