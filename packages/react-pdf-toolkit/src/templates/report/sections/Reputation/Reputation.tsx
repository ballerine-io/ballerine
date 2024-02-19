import { IReputation } from '@/build';
import { Badge } from '@/components/atoms/Badge';
import { Section } from '@/templates/report/components/Section';
import { resolveBadgeStyleToRiskScore } from '@/utils/resolve-badge-style-to-risk-score';
import { FunctionComponent } from 'react';

export interface ReputationProps {
  data: IReputation;
}

export const ReputationSection: FunctionComponent<ReputationProps> = ({ data }) => {
  const {
    summary,
    positiveSignals,
    negativeSignals,
    reputationRiskScore = 0,
    reputationRedFlags,
    industryStandardComparison,
    keyReputationIndicators,
  } = data;

  return (
    <Section title="Reputation">
      <Section.Blocks>
        <Section.Blocks.Block>
          <Section.Blocks.Block.Label text="Reputation Risk Score" />
          <Badge
            text={String(reputationRiskScore || 0)}
            variant={resolveBadgeStyleToRiskScore(reputationRiskScore)}
          />
        </Section.Blocks.Block>
      </Section.Blocks>
      {summary && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Summary" />
          <Section.SummaryBlock.Description text={summary} />
        </Section.SummaryBlock>
      )}
      {industryStandardComparison && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Industry Standart Comparison" />
          <Section.SummaryBlock.Description text={industryStandardComparison} />
        </Section.SummaryBlock>
      )}
      {positiveSignals && (
        <Section.Indicators>
          <Section.Indicators.Title text="Positive Signals" />
          <Section.Indicators.Indicator useIcon={false} text={positiveSignals} />
        </Section.Indicators>
      )}
      {negativeSignals && (
        <Section.Indicators>
          <Section.Indicators.Title text="Negative Signals" />
          <Section.Indicators.Indicator text={negativeSignals} />
        </Section.Indicators>
      )}
      {reputationRedFlags && (
        <Section.Indicators>
          <Section.Indicators.Title text="Reputation Red Flags" />
          <Section.Indicators.Indicator text={reputationRedFlags} />
        </Section.Indicators>
      )}
      {keyReputationIndicators && !!keyReputationIndicators.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="Key Reputation Indicators" />
          {keyReputationIndicators.map(indicator => (
            <Section.Indicators.Indicator
              text={indicator}
              key={`key-reputation-indicator-${indicator}`}
            />
          ))}
        </Section.Indicators>
      )}
    </Section>
  );
};
