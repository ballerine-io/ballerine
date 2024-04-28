import { svgToPng } from '@/common/utils/svg-to-png/svg-to-png';
import { TCustomer } from '@/domains/customer/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export abstract class IPDFRenderer<TPDFData = unknown> {
  static PDF_NAME: string;

  constructor(readonly workflow: TWorkflowById, readonly customer: TCustomer) {}

  abstract render(): Promise<JSX.Element>;

  abstract getData(): Promise<TPDFData>;

  abstract isValid(data: TPDFData): void;

  getLogoUrl(): Promise<string> {
    return svgToPng(this.customer?.logoImageUri || '');
  }
}
