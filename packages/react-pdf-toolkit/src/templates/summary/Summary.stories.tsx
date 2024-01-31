import { Summary } from '@/templates/summary/Summary';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: Summary,
};

export const SummaryTemplate = {
  render: () => (
    <_PDFTemplateBase>
      <Summary />
    </_PDFTemplateBase>
  ),
};
