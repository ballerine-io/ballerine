import { svgToPng } from '@/common/utils/svg-to-png/svg-to-png';
import { TCustomer } from '@/domains/customer/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import poweredByLogo from '../../../../../../../pdfs/case-information/assets/title-page-ballerine-logo.png';

export abstract class IPDFRenderer<TPDFData = unknown> {
  static PDF_NAME: string;

  constructor(readonly workflow: TWorkflowById, readonly customer: TCustomer) {}

  abstract render(): Promise<JSX.Element>;

  abstract getData(): Promise<TPDFData>;

  abstract isValid(data: TPDFData): void;

  async getLogoUrl() {
    try {
      return await svgToPng(this.customer?.logoImageUri || '');
    } catch (error) {
      console.error(`Failed to convert logo to PNG: ${JSON.stringify(error)}`);

      return poweredByLogo;
    }
  }
}
