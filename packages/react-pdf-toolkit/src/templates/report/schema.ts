import { Static, Type } from '@sinclair/typebox';

const ScoreValueType = Type.Optional(
  Type.Union([Type.Null({ default: 0 }), Type.Number({ default: 0 })]),
);

const ViolationType = Type.String();
const IndicatorType = Type.String();
const RiskCategorySchema = Type.Object(
  {
    riskLevel: Type.Optional(Type.String()),
    riskScore: ScoreValueType,
    summary: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);
const RiskAnalysisSchema = Type.Object(
  {
    lineOfBusiness: RiskCategorySchema,
    reputation: RiskCategorySchema,
    traffic: RiskCategorySchema,
    pricing: RiskCategorySchema,
  },
  { additionalProperties: false },
);
const WebsiteCheckSchema = Type.Object(
  {
    website: Type.Optional(Type.String()),
    riskLevel: Type.Optional(Type.String()),
    riskScore: ScoreValueType,
    indicators: Type.Optional(Type.Array(IndicatorType)),
    riskAnalysis: RiskAnalysisSchema,
  },
  { additionalProperties: false },
);

const EcosystemDomainSchema = Type.Object({
  domain: Type.Optional(Type.String()),
  href: Type.String(),
});

const EcosystemWebsiteSchema = Type.Object(
  {
    domain: EcosystemDomainSchema,
    violations: Type.Optional(Type.Array(ViolationType)),
    relatedNodeType: Type.Optional(Type.String()),
    relatedNode: Type.Optional(Type.String()),
    tlRiskScore: ScoreValueType,
    url: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);
const EcosystemChecksSchema = Type.Object(
  {
    riskLevel: Type.Optional(Type.String()),
    riskScore: ScoreValueType,
    url: Type.Optional(Type.String()),
    checkCreatedAt: Type.Optional(Type.String()),
    generalSummary: Type.Optional(Type.String()),
    websites: Type.Optional(Type.Array(EcosystemWebsiteSchema)),
  },
  { additionalProperties: false },
);

const MetaSchema = Type.Object(
  {
    companyName: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);
const SummarySchema = Type.Object(
  {
    transactionLaunderingRiskScore: ScoreValueType,
    websiteSummary: Type.Optional(Type.String()),
    pricingSummary: Type.Optional(Type.String()),
    riskSummary: Type.Optional(Type.String()),
    violations: Type.Optional(Type.Array(ViolationType)),
  },
  { additionalProperties: false },
);

const ReputationSchema = Type.Object(
  {
    summary: Type.Optional(Type.String()),
    negativeSignals: Type.Optional(Type.String()),
    positiveSignals: Type.Optional(Type.String()),
    reputationRedFlags: Type.Optional(Type.String()),
    reputationRiskScore: ScoreValueType,
    industryStandardComparison: Type.Optional(Type.String()),
    keyReputationIndicators: Type.Optional(Type.Array(IndicatorType)),
  },
  { additionalProperties: false },
);

const StructureSchema = Type.Object(
  {
    score: ScoreValueType,
    analysisSummary: Type.Optional(Type.String()),
    suspiciousElements: Type.Optional(Type.Array(IndicatorType)),
  },
  { additionalProperties: false },
);

const PricingSchema = Type.Object(
  {
    discrepancyScore: ScoreValueType,
    pricingPatternsScore: ScoreValueType,
    reasonForDiscrepancy: Type.Optional(Type.String()),
    reasonForPricingPatterns: Type.Optional(Type.String()),
    pricingPatternsIndicators: Type.Optional(Type.Array(IndicatorType)),
    pricingPatternsExamples: Type.Optional(Type.Array(IndicatorType)),
  },
  { additionalProperties: false },
);

const TrafficSchema = Type.Object(
  {
    suspiciousTraffic: Type.Optional(
      Type.Object({
        summary: Type.Optional(Type.String()),
        trafficAnalysisRiskScore: ScoreValueType,
        trafficAnalysisReason: Type.Optional(
          Type.Object({
            explanation: Type.Optional(Type.String()),
            examples: Type.Optional(Type.Array(IndicatorType)),
          }),
        ),
      }),
    ),
  },
  { additionalProperties: false },
);

const LOBSchema = Type.Object(
  {
    businessConsistency: Type.Optional(
      Type.Object({
        summary: Type.Optional(Type.String()),
        lobFromWebsite: Type.Optional(Type.String()),
        lobFromExternalData: Type.Optional(Type.String()),
        lobConsistencyRiskScore: ScoreValueType,
        lobReason: Type.Optional(
          Type.Object({
            explanation: Type.Optional(Type.String()),
            examples: Type.Optional(Type.Array(IndicatorType)),
          }),
        ),
      }),
    ),
  },
  { additionalProperties: false },
);

const ReportSchema = Type.Object(
  {
    status: Type.Optional(Type.String()),
    summary: Type.Optional(SummarySchema),
    reputation: Type.Optional(ReputationSchema),
    structure: Type.Optional(StructureSchema),
    pricing: Type.Optional(PricingSchema),
    traffic: Type.Optional(TrafficSchema),
    LOB: Type.Optional(LOBSchema),
    websiteChecks: Type.Optional(Type.Array(WebsiteCheckSchema)),
    ecosystemChecks: Type.Optional(EcosystemChecksSchema),
    meta: MetaSchema,
  },
  { additionalProperties: false },
);

export type ISummary = Static<typeof SummarySchema>;
export type IReputation = Static<typeof ReputationSchema>;
export type IStructure = Static<typeof StructureSchema>;
export type IPricing = Static<typeof PricingSchema>;
export type ITraffic = Static<typeof TrafficSchema>;
export type ILOB = Static<typeof LOBSchema>;
export type IWebsiteCheck = Array<Static<typeof WebsiteCheckSchema>>;
export type IEcosystemChecks = Static<typeof EcosystemChecksSchema>;
export type IReport = Static<typeof ReportSchema>;

export { ReportSchema };
