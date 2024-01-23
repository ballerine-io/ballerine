import { IPricing } from '@/build';
import { Badge } from '@/components/Badge';
import { Section } from '@/templates/report/components/Section';
import { resolveBadgeStyleToRiskScore } from '@/utils/resolve-badge-style-to-risk-score';
import { FunctionComponent } from 'react';

export interface PricingProps {
  data: IPricing;
}

export const PricingSection: FunctionComponent<PricingProps> = ({ data }) => {
  const {
    discrepancyScore = 0,
    pricingPatternsScore = 0,
    reasonForDiscrepancy,
    reasonForPricingPatterns,
    pricingPatternsExamples,
    pricingPatternsIndicators,
  } = data;

  return (
    <Section title="Pricing">
      <Section.Blocks>
        <Section.Blocks.Block>
          <Section.Blocks.Block.Label text="Discrepancy Score" />
          <Badge
            text={String(discrepancyScore || 0)}
            variant={resolveBadgeStyleToRiskScore(discrepancyScore)}
          />
        </Section.Blocks.Block>
        <Section.Blocks.Block>
          <Section.Blocks.Block.Label text="Pricing Patterns Score" />
          <Badge
            text={String(pricingPatternsScore || 0)}
            variant={resolveBadgeStyleToRiskScore(pricingPatternsScore)}
          />
        </Section.Blocks.Block>
      </Section.Blocks>
      {reasonForDiscrepancy && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Reason for Discrepancy" />
          <Section.SummaryBlock.Description text={reasonForDiscrepancy} />
        </Section.SummaryBlock>
      )}
      {reasonForPricingPatterns && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Reason for Pricing Patterns" />
          <Section.SummaryBlock.Description text={reasonForPricingPatterns} />
        </Section.SummaryBlock>
      )}
      {pricingPatternsIndicators && !!pricingPatternsIndicators.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="Pricing Patterns Indicators" />
          {pricingPatternsIndicators.map(indicator => (
            <Section.Indicators.Indicator text={indicator} key={`pricing-pattern-${indicator}`} />
          ))}
        </Section.Indicators>
      )}
      {pricingPatternsExamples && !!pricingPatternsExamples.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="Pricing Pattern Examples" />
          {pricingPatternsExamples.map(indicator => (
            <Section.Indicators.Indicator
              text={indicator}
              key={`pricing-pattern-examples-${indicator}`}
            />
          ))}
        </Section.Indicators>
      )}
    </Section>
  );
};
