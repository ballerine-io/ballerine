import dayjs from 'dayjs';
import { TBusinessReport } from '../fetchers';
import { REPORT_TYPE_TO_DISPLAY_TEXT } from '@/pages/MerchantMonitoring/schemas';

// Define violation domains as enum
enum ViolationDomain {
  COMPANY_ANALYSIS = 'company analysis',
  CONTENT = 'content',
  SCAM_OR_FRAUD = 'scam or fraud',
  TRAFFIC = 'traffic',
  PRICING = 'pricing',
  WEBSITE_STRUCTURE = 'website structure',
}

export interface BusinessReportCsvData {
  'Merchant ID': string | null;
  'Report ID': string | null;
  'Merchant Name': string | null;
  'Merchant URL': string | null;
  'Risk Level': string | null;
  'Scan Type': string | null;
  'Monitoring Alert': string | null;
  'Company Analysis Findings': string[];
  'Company Analysis Description': string[];
  'Company Analysis Source': string[];
  'Website LOB': string | null;
  'Website MCC': string | null;
  'Violation Type': string[];
  'Why Our AI Flagged this?': string[];
  Source: string[];
  'Violation URL (if applicable)': string[];
  'Website Reputation Findings': string[];
  'Website Reputation Reason': string[];
  'Website Reputation Source': string[];
  'Traffic Findings': string[];
  'Estimated Monthly Visits': string | null;
  'Traffic Sources': string | null;
  'Time on site': string | null;
  'Pages per visit': string | null;
  'Bounce rate': string | null;
  'Pricing Findings': string[];
  'Pricing Findings Details': string[];
  'Pricing Sources': string[];
  'Website Structure Findings': string[];
  Ecosystem: string[];
  'Facebook Link': string | null;
  'Facebook Details': string | null;
  'Instagram Link': string | null;
  'Instagram Details': string | null;
  'Scan Creation Date': Date | null;
  'Report Status': string | null;
  'Status Change Date': Date | null;
  'Notes to Status Change': string | null;
}

/**
 * Helper function to group violations by domain
 * @param violations Array of violations
 * @param domain Domain to filter by
 * @param property Property to extract from violations
 * @returns Array of property values for violations with the specified domain
 */
const getViolationsByDomain = (
  violations: any[] = [],
  domain: ViolationDomain,
  property: string,
): string[] => {
  return violations
    .filter(
      violation => violation.domain?.toLowerCase() === domain.toLowerCase() && violation[property],
    )
    .map(violation => violation[property]);
};

/**
 * Formats business reports data for CSV export
 *
 * @param businessReports - Array of business reports to format
 * @returns Formatted data ready for CSV export
 */
export const formatBusinessReportsForCsv = (
  businessReports: TBusinessReport[],
): BusinessReportCsvData[] => {
  return businessReports.map(report => {
    const violations = report.data?.allViolations || [];

    // Convert creation date to local time (keep as Date object)
    const creationDate = report.createdAt ? dayjs.utc(report.createdAt).local().toDate() : null;

    // Format MCC
    const mcc = report.data?.mcc
      ? `${report.data.mcc} - ${report.data.mccDescription || ''}`
      : null;

    // Format Facebook details
    const facebook = {
      'Facebook Link': report.data?.facebookPage?.url || null,
      'Facebook Details': report.data?.facebookPage || null,
    };

    const instagram = {
      'Instagram Link': report.data?.instagramPage?.url || null,
      'Instagram Details': report.data?.instagramPage || null,
    };

    const pricingViolations = {
      'Pricing Findings': getViolationsByDomain(violations, ViolationDomain.PRICING, 'name'),
      'Pricing Findings Details': getViolationsByDomain(
        violations,
        ViolationDomain.PRICING,
        'reason',
      ),
      'Pricing Sources': getViolationsByDomain(violations, ViolationDomain.PRICING, 'sourceUrl'),
    };

    const scamOrFraudViolations = {
      'Website Reputation Findings': getViolationsByDomain(
        violations,
        ViolationDomain.SCAM_OR_FRAUD,
        'name',
      ),
      'Website Reputation Reason': getViolationsByDomain(
        violations,
        ViolationDomain.SCAM_OR_FRAUD,
        'reason',
      ),
      'Website Reputation Source': getViolationsByDomain(
        violations,
        ViolationDomain.SCAM_OR_FRAUD,
        'sourceUrl',
      ),
    };

    const contentViolations = {
      'Violation Type': getViolationsByDomain(violations, ViolationDomain.CONTENT, 'name'),
      'Why Our AI Flagged this?': getViolationsByDomain(
        violations,
        ViolationDomain.CONTENT,
        'reason',
      ),
      Source: getViolationsByDomain(violations, ViolationDomain.CONTENT, 'quoteFromSource'),
      'Violation URL (if applicable)': getViolationsByDomain(
        violations,
        ViolationDomain.CONTENT,
        'sourceUrl',
      ),
    };

    const companyAnalysisViolations = {
      'Company Analysis Findings': getViolationsByDomain(
        violations,
        ViolationDomain.COMPANY_ANALYSIS,
        'name',
      ),
      'Company Analysis Description': getViolationsByDomain(
        violations,
        ViolationDomain.COMPANY_ANALYSIS,
        'reason',
      ),
      'Company Analysis Source': getViolationsByDomain(
        violations,
        ViolationDomain.COMPANY_ANALYSIS,
        'sourceUrl',
      ),
    };

    return {
      'Merchant ID': report.business?.correlationId || report.business?.id || null,
      'Report ID': report.id || null,
      'Merchant Name': report.companyName || null,
      'Merchant URL': report.website,
      'Risk Level': report.riskLevel || null,
      'Scan Type': REPORT_TYPE_TO_DISPLAY_TEXT[report.reportType] || report.reportType,
      'Monitoring Alert': report.isAlert ? 'Yes' : 'No',
      ...companyAnalysisViolations,
      'Website LOB': report.data?.lineOfBusiness || null,
      'Website MCC': mcc,
      ...contentViolations,
      ...scamOrFraudViolations,
      'Traffic Findings': getViolationsByDomain(violations, ViolationDomain.TRAFFIC, 'name'),
      'Estimated Monthly Visits': report.data?.monthlyVisits || null,
      'Traffic Sources': report.data?.trafficSources || null,
      'Time on site': report.data?.timeOnSite || null,
      'Pages per visit': report.data?.pagesPerVisit || null,
      'Bounce rate': report.data?.bounceRate || null,
      ...pricingViolations,
      'Website Structure Findings': getViolationsByDomain(
        violations,
        ViolationDomain.WEBSITE_STRUCTURE,
        'name',
      ),
      Ecosystem: report.data?.ecosystem || [],
      ...facebook,
      ...instagram,
      'Scan Creation Date': creationDate,
      'Report Status': report.status,
    };
  });
};
