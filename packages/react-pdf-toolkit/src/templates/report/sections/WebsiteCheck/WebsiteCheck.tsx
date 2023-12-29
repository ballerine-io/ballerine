import { Badge } from '@/components/Badge';
import { Section } from '@/templates/report/components/Section';
import { IWebsiteCheck } from '@/templates/report/schema';
import { tw } from '@/theme';
import { Text, View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface WebsiteCheckProps {
  data: IWebsiteCheck;
}

export const WebsiteCheck: FunctionComponent<WebsiteCheckProps> = ({ data }) => {
  return (
    <>
      {data.map(websiteInfo => {
        const { website, riskLevel, riskScore, indicators, riskAnalysis } = websiteInfo;
        const { lineOfBusiness, reputation, traffic, pricing } = riskAnalysis || {};

        return (
          <Section title={`${website} Website TL Check`} key={`website-check-key-${website}`}>
            <Section.Blocks>
              {riskLevel && (
                <Section.Blocks.Block>
                  <Section.Blocks.Block.Label text="General Risk Level" />
                  <Badge text={riskLevel} variant="error" />
                </Section.Blocks.Block>
              )}
              {riskScore && (
                <Section.Blocks.Block>
                  <Section.Blocks.Block.Label text="General Risk Score" />
                  <Badge text={String(riskScore)} variant="error" />
                </Section.Blocks.Block>
              )}
            </Section.Blocks>
            {indicators && !!indicators.length && (
              <Section.Indicators>
                <Section.Indicators.Title text="Indicators" />
                {indicators.map((indicator, index) => (
                  <Section.Indicators.Indicator
                    text={indicator.indicator}
                    key={`indicator-${index}`}
                  />
                ))}
              </Section.Indicators>
            )}
            {lineOfBusiness && (
              <View style={tw('flex flex-col gap-8')}>
                <View style={tw('flex flex-row gap-16 w-full')}>
                  <View style={tw('w-[140px]')}>
                    <Section.Blocks.Block>
                      <Section.Blocks.Block.Label text="Line of business risk score" />
                      <Badge text={String(lineOfBusiness.riskScore)} variant="warning" />
                    </Section.Blocks.Block>
                  </View>
                  <Section.Blocks.Block>
                    <Section.Blocks.Block.Label text="Line of business risk summary" />
                    <View style={tw('overflow-hidden max-w-[400px] pr-10')}>
                      <Text style={tw('text-sm')}>{lineOfBusiness.summary}</Text>
                    </View>
                  </Section.Blocks.Block>
                </View>
              </View>
            )}
            {reputation && (
              <View style={tw('flex flex-col gap-8')}>
                <View style={tw('flex flex-row gap-16 w-full')}>
                  <View style={tw('w-[140px]')}>
                    <Section.Blocks.Block>
                      <Section.Blocks.Block.Label text="Reputation risk score" />
                      <Badge text={String(reputation.riskScore)} variant="warning" />
                    </Section.Blocks.Block>
                  </View>
                  <Section.Blocks.Block>
                    <Section.Blocks.Block.Label text="Reputation risk summary" />
                    <View style={tw('overflow-hidden max-w-[400px] pr-10')}>
                      <Text style={tw('text-sm')}>{reputation.summary}</Text>
                    </View>
                  </Section.Blocks.Block>
                </View>
              </View>
            )}
            {traffic && (
              <View style={tw('flex flex-col gap-8')}>
                <View style={tw('flex flex-row gap-16 w-full')}>
                  <View style={tw('w-[140px]')}>
                    <Section.Blocks.Block>
                      <Section.Blocks.Block.Label text="Traffic risk score" />
                      <Badge text={String(traffic.riskScore)} variant="warning" />
                    </Section.Blocks.Block>
                  </View>
                  <Section.Blocks.Block>
                    <Section.Blocks.Block.Label text="Traffic risk summary" />
                    <View style={tw('overflow-hidden max-w-[400px] pr-10')}>
                      <Text style={tw('text-sm')}>{traffic.summary}</Text>
                    </View>
                  </Section.Blocks.Block>
                </View>
              </View>
            )}
            {pricing && (
              <View style={tw('flex flex-col gap-8')}>
                <View style={tw('flex flex-row gap-16 w-full')}>
                  <View style={tw('w-[140px]')}>
                    <Section.Blocks.Block>
                      <Section.Blocks.Block.Label text="Pricing risk score" />
                      <Badge text={String(pricing.riskScore)} variant="success" />
                    </Section.Blocks.Block>
                  </View>
                  <Section.Blocks.Block>
                    <Section.Blocks.Block.Label text="Pricing risk summary" />
                    <View style={tw('overflow-hidden max-w-[400px] pr-10')}>
                      <Text style={tw('text-sm')}>{pricing.summary}</Text>
                    </View>
                  </Section.Blocks.Block>
                </View>
              </View>
            )}
          </Section>
        );
      })}
    </>
  );
};
