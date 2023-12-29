import { IReport } from '@/templates/report/schema';

export const reportData: IReport = {
  status: 'Published',
  summary: {
    generalRiskLevel: 'High Risk',
    generalRiskScore: 80,
    url: 'http://veaiio.com',
    checkCreatedAt: 'Mon 5 Dec 2023, 15:57',
    generalSummary:
      "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement. Such activities can lead to significant legal and financial consequences, including fines by card schemes and potential termination of payment services. This brief highlights the ecosystem’s potential unauthorized operations and underscores the risks associated with IP violations.",
    violations: [{ type: 'IP_RIGHTS_INFRINGEMENT' }],
    indicators: [
      {
        indicator: 'INCONSISTENT_LINE_OF_BUSINESS_INDICATORS',
        type: 'warning',
      },
      { indicator: 'SUSPICIOUS_TRAFFIC_PATTERNS', type: 'warning' },
      {
        indicator: 'ILLICIT_PRODUCTS_ON_ECOSYSTEM_WEBSITES',
        type: 'warning',
      },
    ],
  },
  websiteChecks: [
    {
      website: 'Veaiio.com',
      riskLevel: 'Medium Risk',
      riskScore: 60,
      indicators: [{ indicator: 'SUSPICIOUS_TRAFFIC_PATTERNS', type: 'warning' }],
      riskAnalysis: {
        lineOfBusiness: {
          riskLevel: 'Medium Risk',
          riskScore: 60,
          summary:
            "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement.",
        },
        reputation: {
          riskLevel: 'Medium Risk',
          riskScore: 60,
          summary:
            "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement.",
        },
        traffic: {
          riskLevel: 'Medium Risk',
          riskScore: 60,
          summary:
            "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement.",
        },
        pricing: {
          riskLevel: 'Medium Risk',
          riskScore: 30,
          summary:
            "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement.",
        },
      },
    },
  ],
  ecosystemChecks: {
    riskLevel: 'High Risk',
    riskScore: 90,
    url: 'http://veaiio.com',
    checkCreatedAt: 'Mon 5 Dec 2023, 15:57',
    generalSummary:
      "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement. Such activities can lead to significant legal and financial consequences, including fines by card schemes and potential termination of payment services. This brief highlights the ecosystem’s potential unauthorized operations and underscores the risks associated with IP violations.",
    websites: [
      {
        url: 'http://poiiao.com',
        violations: [{ type: 'IP_RIGHTS_INFRINGEMENT' }],
        relatedNodeType: 'SUPPORT_EMAIL_ADDRESS',
        relatedNode: 'service@mmyiso.com',
        tlRiskScore: 25,
      },
      {
        url: 'http://kr.feisasell.com',
        violations: [{ type: 'IP_RIGHTS_INFRINGEMENT' }],
        relatedNodeType: 'BUSINESS_REGISTRATION_NUMBER',
        relatedNode: '750-87-02496',
        tlRiskScore: 25,
      },
    ],
  },
  meta: {
    companyId: 'TLR20231205',
    reportId: 'TLR20231205',
    companyName: 'Veaiio.com',
    generatedBy: 'Ballerine Risk Assessment Tool',
    reportVersion: '1.0',
    assessmentMethodology:
      'Cross-referencing public databases, proprietary algorithms, and risk scoring models',
    contactInfo: {
      analystName: 'John Doe',
      analystContact: 'j.doe@ballerine.com',
    },
    confidentialityLevel: 'High - Internal Use Only',
    reportFor: 'Stakeholder Review',
    disclaimer:
      'This report is a snapshot based on the data available at the time of the report creation and is subject to change.',
    additionalNotes:
      'The report summarizes the potential risks associated with Veaiio.com and related entities based on detected indicators of intellectual property (IP) infringement.',
  },
};
