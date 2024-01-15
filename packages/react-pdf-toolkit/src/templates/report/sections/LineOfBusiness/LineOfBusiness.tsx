import { ILOB } from '@/build';
import { Badge } from '@/components/Badge';
import { Section } from '@/templates/report/components/Section';
import { resolveBadgeStyleToRiskScore } from '@/utils/resolve-badge-style-to-risk-score';
import { FunctionComponent } from 'react';

export interface LineOfBusinessProps {
  data: ILOB;
}

export const LineOfBusinessSection: FunctionComponent<LineOfBusinessProps> = ({ data }) => {
  const { businessConsistency } = data;

  const { summary, lobFromWebsite, lobFromExternalData, lobConsistensyRiskScore, lobReason } =
    businessConsistency || {};
  const { explanation, examples } = lobReason || {};

  return (
    <Section title="Line of Business">
      <Section.Blocks>
        {lobConsistensyRiskScore && (
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="LOB Consistency Risk Score" />
            <Badge
              text={String(lobConsistensyRiskScore)}
              variant={resolveBadgeStyleToRiskScore(lobConsistensyRiskScore)}
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
      {lobFromWebsite && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="LOB From Website" />
          <Section.SummaryBlock.Description text={lobFromWebsite} />
        </Section.SummaryBlock>
      )}
      {lobFromExternalData && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="LOB From External Data" />
          <Section.SummaryBlock.Description text={lobFromExternalData} />
        </Section.SummaryBlock>
      )}
      {lobFromExternalData && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="LOB From External Data" />
          <Section.SummaryBlock.Description text={lobFromExternalData} />
        </Section.SummaryBlock>
      )}
      {explanation && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="LOB Reason Explanation" />
          <Section.SummaryBlock.Description text={explanation} />
        </Section.SummaryBlock>
      )}
      {examples && !!examples.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="LOB Examples" />
          {examples.map(indicator => (
            <Section.Indicators.Indicator text={indicator} key={`lob-example-${indicator}`} />
          ))}
        </Section.Indicators>
      )}
    </Section>
  );
};
