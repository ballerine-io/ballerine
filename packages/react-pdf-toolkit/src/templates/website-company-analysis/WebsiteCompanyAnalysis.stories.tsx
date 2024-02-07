import { WebsiteCompanyAnalysisData } from '@/build';
import { WebsiteCompanyAnalysis } from '@/templates/website-company-analysis/WebsiteCompanyAnalysis';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: WebsiteCompanyAnalysis,
};

const websiteCompanyAnalysisData: WebsiteCompanyAnalysisData = {
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

export const Default = {
  render: () => (
    <_PDFTemplateBase>
      <WebsiteCompanyAnalysis data={websiteCompanyAnalysisData} />
    </_PDFTemplateBase>
  ),
};

const websiteCompanyAnalysisEmptyData: WebsiteCompanyAnalysisData = {
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
  scamOrFraud: null,
  businessConsistency: null,
};

export const EmptyState = {
  render: () => (
    <_PDFTemplateBase>
      <WebsiteCompanyAnalysis data={websiteCompanyAnalysisEmptyData} />
    </_PDFTemplateBase>
  ),
};
