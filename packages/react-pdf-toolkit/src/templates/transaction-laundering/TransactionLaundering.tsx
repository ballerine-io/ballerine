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
import { tw } from '@/theme';
import { Page, View } from '@react-pdf/renderer';

export const TransactionLaundering = () => {
  return (
    <Page wrap={false}>
      <Wrapper>
        <Grid>
          <Header
            logoElement={<BallerineLogo />}
            titleElement={
              <Link
                styles={[tw('text-[11px]')]}
                href={'https://example.com'}
                url={new URL('https://example.com').hostname}
              />
            }
            createdAtTimestamp={Date.now()}
          />
          <Section>
            <View style={tw('flex flex-col')}>
              <View style={tw('flex flex-row justify-between mb-8')}>
                <View>
                  <Typography size="title" weight="bold">
                    Transaction Laundering Analysis
                  </Typography>
                </View>
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">Transaction Laundering Risk Score</Typography>
                  <View style={tw('flex flex-row justify-end')}>
                    <Typography weight="bold" size="large" color={'error'}>
                      90
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
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Lorem ipsum dolor sit.</Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
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
                  Multiple sources indicate that ‘Umall Technology S.A.R.L’ is a shell company
                  involved in operating a network of fake shopping sites, which is a common sign of
                  transaction laundering.
                </Typography>
              </View>
            </View>
          </Section>

          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Business Consistency
              </Typography>
              <Typography styles={[tw('leading-6')]}>
                Multiple sources indicate that ‘Umall Technology S.A.R.L’ is a shell company
                involved in operating a network of fake shopping sites, which is a common sign of
                transaction laundering.
              </Typography>
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold">Business Inconsistencies Findings</Typography>
                <List>
                  <ListItem>
                    <Typography>
                      1. “Adolescentm.com is a fraudulent website that lures victims through
                      deceptive promotions."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      2. "Adolescentm.com has a safety score of 0 out of 100."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      3. "Highly unusual and suspicious lack of accounts on Adolescentm.com."
                    </Typography>
                  </ListItem>
                </List>
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Scam or Fraud Indications Assessment
              </Typography>
              <Typography styles={[tw('leading-6')]}>
                Multiple sources indicate that ‘Umall Technology S.A.R.L’ is a shell company
                involved in operating a network of fake shopping sites, which is a common sign of
                transaction laundering.
              </Typography>
              <Typography size="large" weight="bold">
                Appearance in Blacklists / Warnings
              </Typography>
              <Typography styles={[tw('leading-6')]}>
                No indications from the website or external sources suggest that the website has
                appeared in warnings or blacklists.
              </Typography>
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold">Scam or Fraud Findings</Typography>
                <List>
                  <ListItem>
                    <Typography>
                      1. “Adolescentm.com is a fraudulent website that lures victims through
                      deceptive promotions."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      2. "Adolescentm.com has a safety score of 0 out of 100."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      3. "Highly unusual and suspicious lack of accounts on Adolescentm.com."
                    </Typography>
                  </ListItem>
                </List>
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Pricing Analysis
              </Typography>
              <Typography styles={[tw('leading-6')]}>
                Multiple sources indicate that ‘Umall Technology S.A.R.L’ is a shell company
                involved in operating a network of fake shopping sites, which is a common sign of
                transaction laundering.
              </Typography>
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold">Problematic Pricing Findings</Typography>
                <List>
                  <ListItem>
                    <Typography>
                      1. “Adolescentm.com is a fraudulent website that lures victims through
                      deceptive promotions."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      2. "Adolescentm.com has a safety score of 0 out of 100."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      3. "Highly unusual and suspicious lack of accounts on Adolescentm.com."
                    </Typography>
                  </ListItem>
                </List>
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Website Structure Evaluation
              </Typography>
              <Typography styles={[tw('leading-6')]}>
                Multiple sources indicate that ‘Umall Technology S.A.R.L’ is a shell company
                involved in operating a network of fake shopping sites, which is a common sign of
                transaction laundering.
              </Typography>
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold">Website Structure Findings</Typography>
                <List>
                  <ListItem>
                    <Typography>
                      1. “Adolescentm.com is a fraudulent website that lures victims through
                      deceptive promotions."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      2. "Adolescentm.com has a safety score of 0 out of 100."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      3. "Highly unusual and suspicious lack of accounts on Adolescentm.com."
                    </Typography>
                  </ListItem>
                </List>
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Traffic Analysis
              </Typography>
              <Typography styles={[tw('leading-6')]}>
                Multiple sources indicate that ‘Umall Technology S.A.R.L’ is a shell company
                involved in operating a network of fake shopping sites, which is a common sign of
                transaction laundering.
              </Typography>
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold">Suspicious Traffic Findings</Typography>
                <List>
                  <ListItem>
                    <Typography>
                      1. “Adolescentm.com is a fraudulent website that lures victims through
                      deceptive promotions."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      2. "Adolescentm.com has a safety score of 0 out of 100."
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      3. "Highly unusual and suspicious lack of accounts on Adolescentm.com."
                    </Typography>
                  </ListItem>
                </List>
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Transactions Analysis
              </Typography>
              <Typography color="silent" size="medium">
                Not performed
              </Typography>
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
};
