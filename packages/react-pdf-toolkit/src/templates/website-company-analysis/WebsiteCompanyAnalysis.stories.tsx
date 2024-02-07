import { WebsiteCompanyAnalysisData } from '@/build';
import { WebsiteCompanyAnalysis } from '@/templates/website-company-analysis/WebsiteCompanyAnalysis';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: WebsiteCompanyAnalysis,
};

const socialMediaReportData: WebsiteCompanyAnalysisData = {
  website: {
    url: 'https://example.com',
  },
  riskScore: 90,
  companyName: 'Ballerine',
  companyAnalysis: {
    summary:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore nostrum eum consectetur aspernatur! Iste commodi veniam esse consequuntur quas cum dolore, reiciendis officiis sint dignissimos.',
    indicators: [
      'Suspicious Website Company',
      'Suspicious Website Company',
      'Suspicious Website Company',
    ],
  },
  scamOrFraud: {
    summary:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore nostrum eum consectetur aspernatur! Iste commodi veniam esse consequuntur quas cum dolore, reiciendis officiis sint dignissimos.',
    indicators: [
      'Suspicious Website Company',
      'Suspicious Website Company',
      'Suspicious Website Company',
    ],
  },
  businessConsistency: {
    summary:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore nostrum eum consectetur aspernatur! Iste commodi veniam esse consequuntur quas cum dolore, reiciendis officiis sint dignissimos.',
    indicators: [
      'Suspicious Website Company',
      'Suspicious Website Company',
      'Suspicious Website Company',
    ],
  },
};

export const TransactionLaunderingTemplate = {
  render: () => (
    <_PDFTemplateBase>
      <WebsiteCompanyAnalysis data={socialMediaReportData} />
    </_PDFTemplateBase>
  ),
};
