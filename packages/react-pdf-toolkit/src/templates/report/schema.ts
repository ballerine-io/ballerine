import { Static, Type } from '@sinclair/typebox';

const Violation = Type.String();
const Indicator = Type.String();
const RiskCategory = Type.Object({
  riskLevel: Type.String(),
  riskScore: Type.Number(),
  summary: Type.String(),
});
const RiskAnalysis = Type.Object({
  lineOfBusiness: RiskCategory,
  reputation: RiskCategory,
  traffic: RiskCategory,
  pricing: RiskCategory,
});
const WebsiteCheck = Type.Object({
  website: Type.String(),
  riskLevel: Type.String(),
  riskScore: Type.Number(),
  indicators: Type.Array(Indicator),
  riskAnalysis: RiskAnalysis,
});

const EcosystemDomain = Type.Object({
  domain: Type.Optional(Type.String()),
  href: Type.String(),
});

const EcosystemWebsite = Type.Object({
  domain: EcosystemDomain,
  violations: Type.Array(Violation),
  relatedNodeType: Type.String(),
  relatedNode: Type.String(),
  tlRiskScore: Type.Number(),
});
const EcosystemChecks = Type.Object({
  riskLevel: Type.String(),
  riskScore: Type.Number(),
  url: Type.String({ format: 'uri' }),
  checkCreatedAt: Type.String(),
  generalSummary: Type.String(),
  websites: Type.Array(EcosystemWebsite),
});
const ContactInfo = Type.Object({
  analystName: Type.String(),
  analystContact: Type.String(),
});
const Meta = Type.Object({
  companyId: Type.String(),
  reportId: Type.String(),
  companyName: Type.String(),
  generatedBy: Type.String(),
  reportVersion: Type.String(),
  assessmentMethodology: Type.String(),
  contactInfo: ContactInfo,
  confidentialityLevel: Type.String(),
  reportFor: Type.String(),
  disclaimer: Type.String(),
  additionalNotes: Type.String(),
});
const Summary = Type.Object({
  transactionLaunderingRiskScore: Type.Number(),
  websiteSummary: Type.String(),
  pricingSummary: Type.String(),
  riskSummary: Type.String(),
  violations: Type.Array(Violation),
});

const Reputation = Type.Object({
  summary: Type.String(),
  negativeSignals: Type.String(),
  positiveSignals: Type.String(),
  reputationRedFlags: Type.String(),
  reputationRiskScore: Type.Number(),
  industryStandardComparison: Type.String(),
  keyReputationIndicators: Type.Array(Indicator),
});

const Structure = Type.Object({
  score: Type.Number(),
  analysisSummary: Type.String(),
  suspiciousElements: Type.Array(Indicator),
});

const Pricing = Type.Object({
  discrepancyScore: Type.Number(),
  pricingPatternsScore: Type.Number(),
  reasonForDiscrepancy: Type.String(),
  reasonForPricingPatterns: Type.String(),
  pricingPatternsIndicators: Type.Array(Indicator),
  pricingPatternsExamples: Type.Array(Indicator),
});

const Traffic = Type.Object({
  suspiciousTraffic: Type.Object({
    summary: Type.String(),
    trafficAnalysisRiskScore: Type.Number(),
    trafficAnalysisReason: Type.Object({
      explanation: Type.String(),
      examples: Type.Array(Indicator),
    }),
  }),
});

const LOB = Type.Object({
  businessConsistency: Type.Object({
    summary: Type.String(),
    lobFromWebsite: Type.String(),
    lobFromExternalData: Type.String(),
    lobConsistensyRiskScore: Type.Number(),
    lobReason: Type.Object({
      explanation: Type.String(),
      examples: Type.Array(Indicator),
    }),
  }),
});

const Report = Type.Object({
  status: Type.String(),
  summary: Summary,
  reputation: Reputation,
  structure: Structure,
  pricing: Pricing,
  traffic: Traffic,
  LOB: LOB,
  websiteChecks: Type.Array(WebsiteCheck),
  ecosystemChecks: EcosystemChecks,
  meta: Meta,
});

export type ISummary = Static<typeof Summary>;
export type IReputation = Static<typeof Reputation>;
export type IStructure = Static<typeof Structure>;
export type IPricing = Static<typeof Pricing>;
export type ITraffic = Static<typeof Traffic>;
export type ILOB = Static<typeof LOB>;
export type IWebsiteCheck = Array<Static<typeof WebsiteCheck>>;
export type IEcosystemChecks = Static<typeof EcosystemChecks>;
export type IReport = Static<typeof Report>;

export { Report };
