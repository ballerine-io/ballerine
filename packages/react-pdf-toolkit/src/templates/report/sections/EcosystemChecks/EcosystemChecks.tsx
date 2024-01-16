import { Badge } from '@/components/Badge';
import { Link } from '@/components/Link';
import { Section } from '@/templates/report/components/Section';
import { IEcosystemChecks } from '@/templates/report/schema';
import { tw } from '@/theme';
import { resolveBadgeStyleToRiskScore } from '@/utils/resolve-badge-style-to-risk-score';
import { Text, View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface EcosystemChecksProps {
  data: IEcosystemChecks;
}

export const EcosystemChecks: FunctionComponent<EcosystemChecksProps> = ({ data }) => {
  const { riskScore, url, checkCreatedAt, generalSummary, websites } = data;

  return (
    <Section title="Ecosystem domains">
      <Section.Blocks>
        {riskScore && (
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="General Risk Score" />
            <Badge text={String(riskScore)} variant={resolveBadgeStyleToRiskScore(riskScore)} />
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
            <View style={tw('flex flex-row items-center text-[8px] h-[25px]')}>
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
      {websites && !!websites.length && (
        <View style={tw('flex flex-col gap-4')}>
          <View style={tw('flex flex-row gap-4 flex-nowrap')}>
            <Text style={tw('w-[25%] text-[8px] font-bold')}>Domain</Text>
            <Text style={tw('w-[25%] text-[8px] font-bold')}>Related node type</Text>
            <Text style={tw('w-[25%] text-[8px] font-bold')}>Related node</Text>
            <Text style={tw('w-[25%] text-[8px] font-bold')}>TL Risk Score</Text>
          </View>
          {websites.map(website => {
            const { domain, relatedNode, relatedNodeType, tlRiskScore } = website;

            return (
              <View style={tw('flex flex-row gap-4 flex-nowrap')} key={`website-row-${url}`}>
                <Text style={tw('w-[25%] text-[8px]')}>
                  <Link href={domain.href} url={domain.domain ?? domain.href} />
                </Text>
                <Text style={tw('w-[25%] text-[8px]')}>{relatedNodeType}</Text>
                <Text style={tw('w-[25%] text-[8px]')}>{relatedNode}</Text>
                <Text style={tw('w-[25%] text-[8px]')}>
                  <Badge
                    variant={resolveBadgeStyleToRiskScore(tlRiskScore)}
                    text={String(tlRiskScore)}
                  />
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </Section>
  );
};
