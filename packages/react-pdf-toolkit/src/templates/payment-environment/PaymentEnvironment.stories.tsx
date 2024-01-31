import { PaymentEnvironment } from '@/templates/payment-environment/PaymentEnvironment';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: PaymentEnvironment,
};

export const TransactionLaunderingTemplate = {
  render: () => (
    <_PDFTemplateBase>
      <PaymentEnvironment />
    </_PDFTemplateBase>
  ),
};
