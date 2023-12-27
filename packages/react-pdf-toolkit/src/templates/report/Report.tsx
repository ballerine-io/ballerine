import { Badge } from '@/components/Badge';
import { Link } from '@/components/Link';
import { Header } from '@/templates/report/components/Header';
import { Section } from '@/templates/report/components/Section';
import { tw } from '@/theme';
import { Document, Page, Text, View } from '@react-pdf/renderer';

export const ReportTemplate = ({ dynamicValue }: { dynamicValue?: string }) => (
  <Document>
    <Page style={tw('p-7 font-inter flex flex-col gap-8')}>
      <Header title={`Veaiio.com TL Report + ${dynamicValue || ''}`} status="published" />
      <Section>
        <Section.Blocks>
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="General Risk Level" />
            <Badge text="Published" variant="error" />
          </Section.Blocks.Block>
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="General Risk Score" />
            <Badge text="80" variant="error" />
          </Section.Blocks.Block>
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="URL" />
            <Link href="http://veaiio.com" styles={[tw('h-[25px]')]} />
          </Section.Blocks.Block>
          <Section.Blocks.Block>
            <Section.Blocks.Block.Label text="Check Created at" />
            <View style={tw('flex flex-row items-center text-xs h-[25px]')}>
              <Text>Mon 5 Dec 2023, 15:57</Text>
            </View>
          </Section.Blocks.Block>
        </Section.Blocks>
        <Section.SummaryBlock>
          <Section.SummaryBlock.Title text="General Summary" />
          <Section.SummaryBlock.Description text="A check on Veaiio.com's operators revealed multiple websites linked by common email addresses, business registration numbers, and phone numbers, suggesting involvement in intellectual property (IP) infringement. Such activities can lead to significant legal and financial consequences, including fines by card schemes and potential termination of payment services. This brief highlights the ecosystem’s potential unauthorized operations and underscores the risks associated with IP violations." />
        </Section.SummaryBlock>
        <Section.Indicators>
          <Section.Indicators.Title text="Indicators" />
          <Section.Indicators.Indicator text="Inconsistent line of business indicators" />
          <Section.Indicators.Indicator text="Suspicious traffic patterns" />
          <Section.Indicators.Indicator text="Illicit products on ecosystem websites" />
        </Section.Indicators>
      </Section>
    </Page>
  </Document>
);
