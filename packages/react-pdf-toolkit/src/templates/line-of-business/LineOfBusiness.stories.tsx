import { LineOfBusiness } from '@/templates/line-of-business/LineOfBusiness';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: LineOfBusiness,
};

export const TransactionLaunderingTemplate = {
  render: () => (
    <_PDFTemplateBase>
      <LineOfBusiness />
    </_PDFTemplateBase>
  ),
};
