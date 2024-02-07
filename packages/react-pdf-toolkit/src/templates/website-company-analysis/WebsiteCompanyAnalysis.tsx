import { withDataValidation } from '@/build';
import {
  AlertIcon,
  BallerineLogo,
  Disclaimer,
  Divider,
  Footer,
  Grid,
  Header,
  Link,
  List,
  ListItem,
  Section,
  Typography,
  Wrapper,
} from '@/components';
import { WebsiteCompanyAnalysisSchema } from '@/templates/website-company-analysis/schemas/website-company-analysis.schema';
import { WebsiteCompanyAnalysisData } from '@/templates/website-company-analysis/types/website-company-analysis-data.type';
import { tw } from '@/theme';
import { getRiskScoreStyle } from '@/utils';
import { Page, View } from '@react-pdf/renderer';

export type WebsiteCompanyAnalysisProps = {
  data: WebsiteCompanyAnalysisData;
};

export const WebsiteCompanyAnalysis = withDataValidation<WebsiteCompanyAnalysisProps>(
  ({ data }) => {
    const { website, companyName, riskScore, companyAnalysis, businessConsistency, scamOrFraud } =
      data;

    return (
      <Page wrap={false}>
        <Wrapper>
          <Grid>
            <Header
              logoElement={<BallerineLogo />}
              titleElement={
                <Link
                  styles={[tw('text-[11px]')]}
                  href={website.url}
                  url={new URL(website.url).hostname}
                />
              }
              createdAtTimestamp={Date.now()}
            />
            <Section>
              <View style={tw('flex flex-col')}>
                <View style={tw('flex flex-row justify-between mb-8')}>
                  <View>
                    <Typography size="title" weight="bold">
                      Website’s Company Analysis - {'\n'}
                      {companyName}
                    </Typography>
                  </View>
                  <View style={tw('flex flex-col gap-3')}>
                    <Typography weight="bold">Website’s Company Risk Score</Typography>
                    <View style={tw('flex flex-row justify-end')}>
                      <Typography weight="bold" size="large" color={getRiskScoreStyle(riskScore)}>
                        {riskScore}
                      </Typography>
                    </View>
                  </View>
                </View>
                <View style={tw('flex flex-col gap-4')}>
                  <Typography weight="bold" size="heading">
                    Risk Indicators
                  </Typography>
                  <View style={tw('flex flex-row flex-wrap gap-8')}>
                    <View style={tw('flex w-[230px] gap-2 pr-3')}>
                      <List>
                        {companyAnalysis?.indicators.map(indicator => (
                          <ListItem prependIcon={<AlertIcon />} key={indicator}>
                            <Typography>{indicator}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </View>
                  </View>
                </View>
                <Divider styles={[tw('my-6')]} />
                <View style={tw('flex flex-col gap-4')}>
                  <Typography weight="bold" size="heading">
                    Risk Summary
                  </Typography>
                  <Typography styles={[tw('text-justify leading-6')]}>
                    {companyAnalysis?.summary}
                  </Typography>
                </View>
              </View>
            </Section>

            <Section>
              <View style={tw('flex flex-col gap-6')}>
                <Typography size="large" weight="bold">
                  Business Consistency
                </Typography>
                {businessConsistency ? (
                  <>
                    <Typography styles={[tw('leading-6')]}>
                      {businessConsistency?.summary}
                    </Typography>
                    <View style={tw('flex flex-col gap-4')}>
                      <Typography weight="bold">Business Inconsistencies Findings</Typography>
                      <List>
                        {businessConsistency?.indicators?.map((indicator, index) => (
                          <ListItem key={index}>
                            <Typography>
                              {index + 1}. {indicator}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </View>
                  </>
                ) : (
                  <Typography styles={[tw('leading-6')]}>
                    The company's name and associated business activities are consistent across
                    various sources.
                  </Typography>
                )}
              </View>
            </Section>
            <Section>
              <View style={tw('flex flex-col gap-6')}>
                <Typography size="large" weight="bold">
                  Scam or Fraud Indications Assessment
                </Typography>
                {scamOrFraud ? (
                  <>
                    <Typography styles={[tw('leading-6')]}>{scamOrFraud?.summary}</Typography>
                    <View style={tw('flex flex-col gap-4')}>
                      <Typography weight="bold">Scam or Fraud Findings</Typography>
                      <List>
                        {scamOrFraud?.indicators?.map((indicator, index) => (
                          <ListItem key={index}>
                            <Typography>
                              {index + 1}. {indicator}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </View>
                  </>
                ) : (
                  <Typography styles={[tw('leading-6')]}>
                    No reviews or complaints indicating scam or fraud found.
                  </Typography>
                )}
              </View>
            </Section>
            <Footer
              domain="www.ballerine.com"
              contactEmail="support@ballerine.com"
              companyName="Ballerine"
            />
            <Disclaimer />
          </Grid>
        </Wrapper>
      </Page>
    );
  },
  WebsiteCompanyAnalysisSchema,
);
