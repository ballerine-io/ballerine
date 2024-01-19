import { Badge } from '@/components/Badge';
import { Section } from '@/templates/report/components/Section';
import { ISummary } from '@/templates/report/schema';
import { resolveBadgeStyleToRiskScore } from '@/utils/resolve-badge-style-to-risk-score';
import { FunctionComponent } from 'react';

export interface SummaryProps {
  data: ISummary;
}

export const SummarySection: FunctionComponent<SummaryProps> = ({ data }) => {
  const {
    transactionLaunderingRiskScore = 0,
    websiteSummary,
    pricingSummary,
    riskSummary,
    violations,
  } = data;

  return (
    <Section title="Summary">
      <Section.Blocks>
        <Section.Blocks.Block>
          <Section.Blocks.Block.Label text="Transaction Laundering Risk Score" />
          <Badge
            text={String(transactionLaunderingRiskScore || 0)}
            variant={resolveBadgeStyleToRiskScore(transactionLaunderingRiskScore)}
          />
        </Section.Blocks.Block>
      </Section.Blocks>
      {websiteSummary && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Website Summary" />
          <Section.SummaryBlock.Description text={websiteSummary} />
        </Section.SummaryBlock>
      )}
      {pricingSummary && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Pricing Summary" />
          <Section.SummaryBlock.Description text={pricingSummary} />
        </Section.SummaryBlock>
      )}
      {riskSummary && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Risk Summary" />
          <Section.SummaryBlock.Description text={riskSummary} />
        </Section.SummaryBlock>
      )}
      {violations && !!violations.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="Indicators" />
          {violations.map((violation, index) => (
            <Section.Indicators.Indicator text={violation} key={`indicator-${index}`} />
          ))}
        </Section.Indicators>
      )}
    </Section>
  );
};
