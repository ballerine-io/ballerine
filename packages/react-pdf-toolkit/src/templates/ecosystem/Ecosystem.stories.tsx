import { Ecosystem } from '@/templates/ecosystem/Ecosystem';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: Ecosystem,
};

export const TransactionLaunderingTemplate = {
  render: () => (
    <_PDFTemplateBase>
      <Ecosystem />
    </_PDFTemplateBase>
  ),
};
