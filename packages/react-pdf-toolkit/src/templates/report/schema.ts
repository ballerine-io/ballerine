import { Type, Static } from '@sinclair/typebox';

const Violation = Type.Object({
  type: Type.String(),
});
const Indicator = Type.Object({
  indicator: Type.String(),
  type: Type.String(),
});
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
const EcosystemWebsite = Type.Object({
  url: Type.String({ format: 'uri' }),
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
  generalRiskLevel: Type.String(),
  generalRiskScore: Type.Number(),
  url: Type.String({ format: 'uri' }),
  checkCreatedAt: Type.String(),
  generalSummary: Type.String(),
  violations: Type.Array(Violation),
  indicators: Type.Array(Indicator),
});
const Report = Type.Object({
  status: Type.String(),
  summary: Summary,
  websiteChecks: Type.Array(WebsiteCheck),
  ecosystemChecks: EcosystemChecks,
  meta: Meta,
});

export type ISummary = Static<typeof Summary>;
export type IWebsiteCheck = Array<Static<typeof WebsiteCheck>>;
export type IEcosystemChecks = Static<typeof EcosystemChecks>;
export type IReport = Static<typeof Report>;

export { Report };
