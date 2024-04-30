import { IPDFRenderer } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/renderers/pdf-renderer.abstract';
import {
  IdentityVerificationsPage,
  IdentityVerificationsSchema,
  TIdentityVerificationsData,
} from '@/pages/Entity/pdfs/case-information/pages/IdentityVerificationsPage';
import get from 'lodash/get';
import map from 'lodash/map';
import values from 'lodash/values';

export class IdentityVerificationsPagePDF extends IPDFRenderer<TIdentityVerificationsData> {
  static PDF_NAME = 'identityVerificationsPage';

  async render(): Promise<JSX.Element> {
    const pdfData = await this.getData();
    this.isValid(pdfData);

    return <IdentityVerificationsPage data={pdfData} />;
  }

  async getData() {
    const pdfData: TIdentityVerificationsData = {
      companyName: get(this.workflow?.context, 'entity.data.companyName', ''),
      creationDate: new Date(),
      logoUrl: await this.getLogoUrl(),
      items: map(
        values(get(this.workflow?.context, 'childWorkflows.kyc_email_session_example', {})),
        (session): TIdentityVerificationsData['items'][number] => ({
          firstName: get(session, 'result.childEntity.firstName', ''),
          lastName: get(session, 'result.childEntity.lastName', ''),
          dateOfBirth: get(session, 'result.entity.data.dateOfBirth'),
          status: get(session, 'result.vendorResult.decision.status', '') as
            | 'approved'
            | 'rejected',
          checkDate: get(session, 'result.vendorResult.aml.createdAt'),
          id: get(session, 'result.vendorResult.metadata.id', ''),
          gender: get(session, 'result.vendorResult.entity.data.additionalInfo.gender', ''),
          nationality: get(
            session,
            'result.vendorResult.entity.data.additionalInfo.nationality',
            '',
          ),
          reason: get(session, 'result.vendorResult.decision.reason', ''),
        }),
      ),
    };

    return pdfData;
  }

  isValid(data: TIdentityVerificationsData) {
    IdentityVerificationsSchema.parse(data);
  }
}
