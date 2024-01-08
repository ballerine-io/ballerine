import { ViewerDEV } from '@/components/ViewerDEV';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { IReport, ReportTemplate } from './templates/report';
registerFont(Font);

const reportData: Partial<IReport> = {
  status: 'Published',
  summary: {
    violations: [
      'Active sale of controlled substances online without proper licensing',
      'Encouragement of cryptocurrency payments potentially to evade financial scrutiny',
      'Presence of highly suspicious pricing patterns and inconsistencies',
      'Negative reputation markers, including scam advisories and unsafe listings',
      'Irregular and suspicious website traffic patterns',
    ],
    riskSummary:
      'This website displays multiple high-risk indicators for transaction laundering, evidenced by the sale of illegal drugs, lack of traffic transparency, and engagement in questionable business practices that deviate from industry standards. The website has been flagged negatively across various platforms, indicating a high likelihood of illegal activity.',
    pricingSummary:
      'The presence of prescription drugs and controlled substances with unusually low and broad price ranges suggests atypical pricing for legitimate pharmaceutical sales, further raising suspicions of transaction laundering.',
    websiteSummary:
      'Megapharmacy24.com is positioned as an online pharmacy reportedly offering a range of pharmaceutical products, including controlled substances typically not available online legally. The website structure promotes unclear and automated content generation, and there is an encouragement for payment via Bitcoin, implying an interest in obscuring financial transactions.',
    transactionLaunderingRiskScore: 92,
  },
  reputation: {
    summary:
      'Based on the provided data, megapharmacy24.com has numerous indicators of transaction laundering and involvement in illicit drug sales. There is strong evidence suggesting that online transactions may be used to conceal the true nature of the financial activity, representing a significant risk for potential fraud, drug trafficking, and violation of laws. The website has a high reputation risk score, and caution is advised when considering any form of interaction or transaction with this website.',
    negativeSignals:
      'The site is involved in the sale of controlled substances like Xanax, Vyvanse, Cocaine, etc., which are generally prohibited from online sale without the oversight of legitimate medical and pharmaceutical practices.',
    positiveSignals: '',
    reputationRedFlags:
      'The sale of illegal drugs online, numerous scam advisories reported by users and warning flags raised by automated website verification tools, and a pattern of association with known suspicious or malicious websites.',
    reputationRiskScore: 100,
    keyReputationIndicators: [
      'Claims of selling illegal drugs such as meth and cocaine',
      'Multiple negative reviews and scam advisories across various sites',
      'Listed as unsafe by Web of Trust with high confidence',
      'Associations with suspicious or malicious websites',
    ],
    industryStandardComparison:
      "The site's offerings and reputation are not in line with legitimate pharmaceutical industry standards, which require regulatory compliance, a verifiable physical presence, and adherence to legal constraints for the sale of prescription medications.",
  },
  structure: {
    score: 85,
    analysisSummary:
      "The website is suspicious because it lists products that are controlled substances, suggesting the potential sale of pharmaceuticals without proper licensing. The promotion of Bitcoin payment and the presence of gibberish content as well as the use of terms like 'med plug' in customer reviews are all indicative of a website that may be involved in transaction laundering or the illegal sale of drugs. Despite having some typical structure such as contact and policy information, the nature of the products sold and the way they are presented casts considerable doubt on the legitimacy of the merchant.",
    suspiciousElements: [
      'The products listed are potential controlled substances, pharmaceuticals not usually available through online retail without proper licensing.',
      'The use of Bitcoin is encouraged, which could be indicative of trying to circumvent normal financial reporting requirements.',
      'Inconsistencies in content, misspellings, and missing parts of words indicate low quality or automated content generation which can be associated with fraudulent sites.',
      "Customer reviews mention 'reliable med plug', which could suggest an illegal drug supply operation.",
      "The website has products with high abuse potential listed like 'Meth', 'Xanax', 'Opioids', which raises suspicion about the legality of the merchant's operations.",
    ],
  },
  pricing: {
    discrepancyScore: 100,
    pricingPatternsScore: 95,
    reasonForDiscrepancy:
      'The products listed for sale are controlled substances and prescription drugs, which are illegal to sell online without proper authorization.',
    pricingPatternsExamples: [
      'Cocaine listed at $45.00, which is not a legal online product',
      'Buy Promethazine with Codeine Oral solution online ranging from $650.00 - $1,100.00',
      'DMT (N,N-Dimethyltryptamine) for sale at price ranges of $150.00 - $6,500.00',
      'Controlled prescription drugs such as Hydrocodone and Adderall priced at $2.00 and $3.00',
    ],
    reasonForPricingPatterns:
      'Several prescription drugs and controlled substances are listed with unusually low or broad price ranges, which is highly irregular for legitimate pharmaceutical sales.',
    pricingPatternsIndicators: [
      'Sale of illegal substances in an open platform',
      'Inconsistent pricing for prescription medications',
      'Extremely low pricing for products generally considered high value on the black market',
      'Price ranges instead of fixed prices for pharmaceuticals',
      'The same price listed for different types of drugs, which normally have a wide range of market values',
    ],
  },
  traffic: {
    suspiciousTraffic: {
      summary:
        "Upon analyzing the traffic and business data, several red flags are apparent. The inconsistencies between the business line suggesting a legitimate online pharmacy and the website's title indirectly promoting a controlled substance, as well as the erratic traffic patterns, point towards possible transaction laundering activities. The lack of consistent traffic, direct sources, and transparency raises the risk score significantly. The observed patterns are not characteristic of a regular online pharmacy and warrant further investigation.",
      trafficAnalysisReason: {
        examples: [
          'Sudden spike in website traffic followed by a drop to zero with no apparent cause.',
          "Title includes 'buy crystal meth', which is unusual and suspicious for a legitimate pharmacy.",
          'Lack of referral sources coupled with use of an ad network suggests attempts to artificially inflate traffic or obfuscate real traffic sources.',
        ],
        explanation:
          "The nature of the business and the website traffic patterns suggest potential transaction laundering concerns. The site appears to be positioned as a legitimate online pharmacy, a type consistent with healthcare and pharmaceuticals. However, some red flags raised include the title mentioning 'buy crystal meth,' a substance commonly associated with illegal activities. Moreover, there was a sudden spike and then a drop to zero in the website traffic without explanation, while there is an indication of ad network use without other referrers, indicating possible lack of marketing transparency.",
      },
      trafficAnalysisRiskScore: 80,
    },
  },
  LOB: {
    businessConsistensy: {
      summary:
        "After analysis of available data, the site megapharmacy24.com exhibits a high risk score regarding Line of Business (LOB) consistency, with a score of 95. This score is attributed to significant discrepancies between the site's pharmacy claims and the presence of illegal substances being advertised for sale. External evaluations and SERP indicators consistently flag the website as suspicious or fraudulent, and the site has been reported to scam advice services. The evidence strongly suggests that this website may be engaging in transaction laundering by using the facade of a legitimate pharmacy to move funds related to illicit drug sales. The business consistency analysis reinforces concerns regarding the website's legitimacy, and the lack of credible LOB substantiation from external sources indicates a high likelihood of transaction laundering activities.",
      lobReason: {
        examples: [
          'Listings of illegal drugs being sold online',
          'Numerous negative reviews and scam advisor warnings',
          'Mismatch between the LEGITIMATE pharmacy LOB and the ACTUAL products being trafficked',
        ],
        explanation:
          'There are multiple indicators suggesting that the site may be involved in illicit activities, which constitutes a high risk of transaction laundering. Numerous reviews and search engine results label the site as suspicious or outright scam. Additionally, the LOB declared on the site is not consistent with legitimate pharmacy practices, as it includes the sale of illegal substances (e.g., Xanax, Vyvanse, Cocaine online).',
      },
      lobFromWebsite:
        'Online sale of pharmaceuticals including prohibited substances such as Meth, Xanax, Vyvanse, and Cocaine',
      lobFromExternalData:
        'External data suggests a scam or illegitimate business practices concerning pharmacy services',
      lobConsistensyRiskScore: 95,
    },
  },
  meta: {
    companyName: 'Test',
  } as IReport['meta'],
  // websiteChecks: [
  //   {
  //     website: 'Veaiio.com',
  //     riskLevel: 'Medium Risk',
  //     riskScore: 60,
  //     indicators: [{ indicator: 'SUSPICIOUS_TRAFFIC_PATTERNS', type: 'warning' }],
  //     riskAnalysis: {
  //       lineOfBusiness: {
  //         riskLevel: 'Medium Risk',
  //         riskScore: 60,
  //         summary:
  //           "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement.",
  //       },
  //       reputation: {
  //         riskLevel: 'Medium Risk',
  //         riskScore: 60,
  //         summary:
  //           "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement.",
  //       },
  //       traffic: {
  //         riskLevel: 'Medium Risk',
  //         riskScore: 60,
  //         summary:
  //           "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement.",
  //       },
  //       pricing: {
  //         riskLevel: 'Medium Risk',
  //         riskScore: 30,
  //         summary:
  //           "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement.",
  //       },
  //     },
  //   },
  // ],
  // ecosystemChecks: {
  //   riskLevel: 'High Risk',
  //   riskScore: 90,
  //   url: 'http://veaiio.com',
  //   checkCreatedAt: 'Mon 5 Dec 2023, 15:57',
  //   generalSummary:
  //     "A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement. Such activities can lead to significant legal and financial consequences, including fines by card schemes and potential termination of payment services. This brief highlights the ecosystem’s potential unauthorized operations and underscores the risks associated with IP violations.",
  //   websites: [
  //     {
  //       url: 'http://poiiao.com',
  //       violations: [{ type: 'IP_RIGHTS_INFRINGEMENT' }],
  //       relatedNodeType: 'SUPPORT_EMAIL_ADDRESS',
  //       relatedNode: 'service@mmyiso.com',
  //       tlRiskScore: 25,
  //     },
  //     {
  //       url: 'http://kr.feisasell.com',
  //       violations: [{ type: 'IP_RIGHTS_INFRINGEMENT' }],
  //       relatedNodeType: 'BUSINESS_REGISTRATION_NUMBER',
  //       relatedNode: '750-87-02496',
  //       tlRiskScore: 25,
  //     },
  //   ],
  // },
  // meta: {
  //   companyId: 'TLR20231205',
  //   reportId: 'TLR20231205',
  //   companyName: 'Veaiio.com',
  //   generatedBy: 'Ballerine Risk Assessment Tool',
  //   reportVersion: '1.0',
  //   assessmentMethodology:
  //     'Cross-referencing public databases, proprietary algorithms, and risk scoring models',
  //   contactInfo: {
  //     analystName: 'John Doe',
  //     analystContact: 'j.doe@ballerine.com',
  //   },
  //   confidentialityLevel: 'High - Internal Use Only',
  //   reportFor: 'Stakeholder Review',
  //   disclaimer:
  //     'This report is a snapshot based on the data available at the time of the report creation and is subject to change.',
  //   additionalNotes:
  //     'The report summarizes the potential risks associated with Veaiio.com and related entities based on detected indicators of intellectual property (IP) infringement.',
  // },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="h-screen">
    <ViewerDEV>
      <ReportTemplate report={reportData as IReport} />
    </ViewerDEV>
  </div>,
);
