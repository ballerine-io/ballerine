import { Badge } from '@/components/Badge';
import { Link } from '@/components/Link';
import { Section } from '@/templates/report/components/Section';
import { ISummary } from '@/templates/report/schema';
import { tw } from '@/theme';
import { Text, View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface SummaryProps {
  data: ISummary;
}

export const SummarySection: FunctionComponent<SummaryProps> = ({ data }) => {
  const {
    generalRiskLevel,
    generalRiskScore,
    generalSummary,
    url,
    checkCreatedAt,
    violations,
    indicators,
  } = data;

  return (
    <Section title="Summary">
      <Section.Blocks>
        {generalRiskLevel && (
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="General Risk Level" />
            <Badge text={generalRiskLevel} variant="error" />
          </Section.Blocks.Block>
        )}
        {generalRiskScore && (
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="General Risk Score" />
            <Badge text={String(generalRiskScore)} variant="error" />
          </Section.Blocks.Block>
        )}
        {url && (
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="URL" />
            <Link href={url} styles={[tw('h-[25px]')]} />
          </Section.Blocks.Block>
        )}
        {checkCreatedAt && (
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="Check Created at" />
            <View style={tw('flex flex-row items-center text-xs h-[25px]')}>
              <Text>{checkCreatedAt}</Text>
            </View>
          </Section.Blocks.Block>
        )}
      </Section.Blocks>
      {generalSummary && (
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="General Summary" />
          <Section.SummaryBlock.Description text={generalSummary} />
        </Section.SummaryBlock>
      )}
      {indicators && !!indicators.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="Indicators" />
          {indicators.map((indicator, index) => (
            <Section.Indicators.Indicator text={indicator.indicator} key={`indicator-${index}`} />
          ))}
        </Section.Indicators>
      )}
      {violations && !!violations.length && (
        <Section.Indicators>
          <Section.Indicators.Title text="Violations" />
          {violations.map((violation, index) => (
            <Section.Indicators.Indicator text={violation.type} key={`violation-${index}`} />
          ))}
        </Section.Indicators>
      )}
    </Section>
  );
};
