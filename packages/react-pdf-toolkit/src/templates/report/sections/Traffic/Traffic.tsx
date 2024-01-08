import { ITraffic } from '@/build';
import { Badge } from '@/components/Badge';
import { Section } from '@/templates/report/components/Section';
import { resolveBadgeStyleToRiskScore } from '@/utils/resolve-badge-style-to-risk-score';
import { FunctionComponent } from 'react';

export interface TrafficProps {
  data: ITraffic;
}

export const TrafficSection: FunctionComponent<TrafficProps> = ({ data }) => {
  const { suspiciousTraffic } = data;

  const { summary, trafficAnalysisRiskScore, trafficAnalysisReason } = suspiciousTraffic || {};
  const { examples, explanation } = trafficAnalysisReason || {};

  return (
    <Section title="Traffic">
      <Section.Blocks>
        {trafficAnalysisRiskScore && (
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="Traffic Risk Score" />
            <Badge
              text={String(trafficAnalysisRiskScore)}
              variant={resolveBadgeStyleToRiskScore(trafficAnalysisRiskScore)}
            />
          </Section.Blocks.Block>
        )}
      </Section.Blocks>
      {summary && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Summary" />
          <Section.SummaryBlock.Description text={summary} />
        </Section.SummaryBlock>
      )}
      {explanation && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Traffic Analysis Explanation" />
          <Section.SummaryBlock.Description text={explanation} />
        </Section.SummaryBlock>
      )}
      {examples && !!examples.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="Traffic Analysis Examples" />
          {examples.map(indicator => (
            <Section.Indicators.Indicator text={indicator} key={`traffic-example-${indicator}`} />
          ))}
        </Section.Indicators>
      )}
    </Section>
  );
};
