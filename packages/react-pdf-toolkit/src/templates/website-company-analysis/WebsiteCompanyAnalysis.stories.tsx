import { WebsiteCompanyAnalysis } from '@/templates/website-company-analysis/WebsiteCompanyAnalysis';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: WebsiteCompanyAnalysis,
};

export const TransactionLaunderingTemplate = {
  render: () => (
    <_PDFTemplateBase>
      <WebsiteCompanyAnalysis />
    </_PDFTemplateBase>
  ),
};
