import { IStructure } from '@/build';
import { Badge } from '@/components/atoms/Badge';
import { Section } from '@/templates/report/components/Section';
import { getRiskScoreStyle } from '@/utils';
import { FunctionComponent } from 'react';

export interface StructureProps {
  data: IStructure;
}

export const StructureSection: FunctionComponent<StructureProps> = ({ data }) => {
  const { score = 0, analysisSummary, suspiciousElements } = data;

  return (
    <Section title="Structure">
      <Section.Blocks>
        <Section.Blocks.Block>
          <Section.Blocks.Block.Label text="Structure Risk Score" />
          <Badge text={String(score || 0)} variant={getRiskScoreStyle(score)} />
        </Section.Blocks.Block>
      </Section.Blocks>
      {analysisSummary && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="Analysis Summary" />
          <Section.SummaryBlock.Description text={analysisSummary} />
        </Section.SummaryBlock>
      )}
      {suspiciousElements && !!suspiciousElements.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="Key Reputation Indicators" />
          {suspiciousElements.map(indicator => (
            <Section.Indicators.Indicator
              text={indicator}
              key={`suspicious-element-${indicator}`}
            />
          ))}
        </Section.Indicators>
      )}
    </Section>
  );
};
