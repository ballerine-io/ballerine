import { TransactionLaundering } from '@/templates/transaction-laundering/TransactionLaundering';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: TransactionLaundering,
};

export const TransactionLaunderingTemplate = {
  render: () => (
    <_PDFTemplateBase>
      <TransactionLaundering />
    </_PDFTemplateBase>
  ),
};
